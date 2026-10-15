import { Router } from "express";
import { eq } from "drizzle-orm";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  type ForgotPasswordInput,
  type LoginInput,
  type RegisterInput,
  type ResetPasswordInput,
} from "@bookwise/shared";
import { db } from "../db";
import { passwordResetTokens, sessions, users } from "../db/schema";
import { generateToken, hashPassword, hashToken, verifyPassword } from "../lib/crypto";
import { createSession, destroySession, getSessionUser } from "../lib/session";
import { validateBody } from "../middleware/validate";

const RESET_TTL_MS = 60 * 60 * 1000;
const UNIQUE_VIOLATION = "23505";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), async (req, res) => {
  const { name, email, password } = req.body as RegisterInput;
  try {
    const [user] = await db
      .insert(users)
      .values({ name, email, passwordHash: await hashPassword(password) })
      .returning({ id: users.id, name: users.name, email: users.email });
    await createSession(res, user!.id);
    res.status(201).json(user);
  } catch (err) {
    if ((err as { cause?: { code?: string } }).cause?.code === UNIQUE_VIOLATION) {
      return res.status(409).json({ error: "EmailTaken" });
    }
    throw err;
  }
});

authRouter.post("/login", validateBody(loginSchema), async (req, res) => {
  const { email, password } = req.body as LoginInput;
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return res.status(401).json({ error: "InvalidCredentials" });
  }
  await createSession(res, user.id);
  res.json({ id: user.id, name: user.name, email: user.email });
});

authRouter.post("/logout", async (req, res) => {
  await destroySession(req, res);
  res.status(204).end();
});

authRouter.get("/me", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  res.json(user);
});

authRouter.post(
  "/forgot-password",
  validateBody(forgotPasswordSchema),
  async (req, res) => {
    const { email } = req.body as ForgotPasswordInput;
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (user) {
      const token = generateToken();
      await db.insert(passwordResetTokens).values({
        tokenHash: hashToken(token),
        userId: user.id,
        expiresAt: new Date(Date.now() + RESET_TTL_MS),
      });
      // TODO: send by email once a mail provider is chosen
      const appUrl = process.env.APP_URL ?? "http://localhost:5173";
      console.log(`Password reset link for ${email}: ${appUrl}/reset-password?token=${token}`);
    }
    // Same response whether or not the account exists, to avoid leaking emails
    res.status(204).end();
  },
);

authRouter.post(
  "/reset-password",
  validateBody(resetPasswordSchema),
  async (req, res) => {
    const { token, password } = req.body as ResetPasswordInput;
    const passwordHash = await hashPassword(password);
    const ok = await db.transaction(async (tx) => {
      // Deleting is the atomic "use once" claim
      const [row] = await tx
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.tokenHash, hashToken(token)))
        .returning();
      if (!row || row.expiresAt < new Date()) return false;
      await tx.update(users).set({ passwordHash }).where(eq(users.id, row.userId));
      await tx.delete(sessions).where(eq(sessions.userId, row.userId));
      return true;
    });
    if (!ok) return res.status(400).json({ error: "InvalidOrExpiredToken" });
    res.status(204).end();
  },
);
