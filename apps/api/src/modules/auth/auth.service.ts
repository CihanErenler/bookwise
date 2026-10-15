import type {
  AuthUser,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "@bookwise/shared";
import {
  generateToken,
  hashPassword,
  hashToken,
  verifyPassword,
} from "../../lib/crypto";
import { sendPasswordResetEmail } from "../../lib/email";
import { AppError } from "../../lib/errors";
import * as repository from "./auth.repository";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const RESET_TTL_MS = 60 * 60 * 1000;

export type Session = { token: string; expiresAt: Date };

const toAuthUser = ({ id, name, email }: AuthUser): AuthUser => ({ id, name, email });

const startSession = async (userId: string): Promise<Session> => {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await repository.createSession({ tokenHash: hashToken(token), userId, expiresAt });
  return { token, expiresAt };
};

export const register = async ({ name, email, password }: RegisterInput) => {
  const user = await repository.createUser({
    name,
    email,
    passwordHash: await hashPassword(password),
  });
  if (!user) throw new AppError(409, "EmailTaken");
  return { user: toAuthUser(user), session: await startSession(user.id) };
};

export const login = async ({ email, password }: LoginInput) => {
  const user = await repository.findUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw new AppError(401, "InvalidCredentials");
  }
  return { user: toAuthUser(user), session: await startSession(user.id) };
};

export const logout = (sessionToken: string) =>
  repository.deleteSession(hashToken(sessionToken));

export const getCurrentUser = async (sessionToken: string) => {
  const user = await repository.findUserBySession(hashToken(sessionToken), new Date());
  if (!user) throw new AppError(401, "Unauthorized");
  return user;
};

export const forgotPassword = async ({ email }: ForgotPasswordInput) => {
  const user = await repository.findUserByEmail(email);
  if (!user) return; // the caller responds identically, so emails can't be probed

  const token = generateToken();
  await repository.createPasswordResetToken({
    tokenHash: hashToken(token),
    userId: user.id,
    expiresAt: new Date(Date.now() + RESET_TTL_MS),
  });
  const appUrl = process.env.APP_URL ?? "http://localhost:5173";
  // Not awaited: response time must not reveal whether the account exists
  sendPasswordResetEmail(email, `${appUrl}/reset-password?token=${token}`).catch(
    (err) => console.error("Failed to send password reset email:", err),
  );
};

export const resetPassword = async ({ token, password }: ResetPasswordInput) => {
  const ok = await repository.resetPasswordWithToken(
    hashToken(token),
    await hashPassword(password),
    new Date(),
  );
  if (!ok) throw new AppError(400, "InvalidOrExpiredToken");
};
