import { and, eq, gt } from "drizzle-orm";
import { db } from "../../db";
import { passwordResetTokens, sessions, users } from "../../db/schema";

export const findUserByEmail = async (email: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
};

/** Returns undefined when the email is already taken. */
export const createUser = async (values: {
  name: string;
  email: string;
  passwordHash: string;
}) => {
  const [user] = await db
    .insert(users)
    .values(values)
    .onConflictDoNothing({ target: users.email })
    .returning();
  return user;
};

export const createSession = (values: {
  tokenHash: string;
  userId: string;
  expiresAt: Date;
}) => db.insert(sessions).values(values);

export const deleteSession = (tokenHash: string) =>
  db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));

export const findUserBySession = async (tokenHash: string, now: Date) => {
  const [user] = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, now)));
  return user;
};

export const createPasswordResetToken = (values: {
  tokenHash: string;
  userId: string;
  expiresAt: Date;
}) => db.insert(passwordResetTokens).values(values);

/**
 * Atomically consumes an unexpired reset token, sets the new password and signs
 * the user out everywhere. Returns false if the token is unknown or expired.
 */
export const resetPasswordWithToken = (
  tokenHash: string,
  passwordHash: string,
  now: Date,
) =>
  db.transaction(async (tx) => {
    // Deleting is the atomic "use once" claim
    const [token] = await tx
      .delete(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.tokenHash, tokenHash),
          gt(passwordResetTokens.expiresAt, now),
        ),
      )
      .returning();
    if (!token) return false;
    await tx.update(users).set({ passwordHash }).where(eq(users.id, token.userId));
    await tx.delete(sessions).where(eq(sessions.userId, token.userId));
    return true;
  });
