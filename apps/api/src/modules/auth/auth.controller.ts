import type { Request, RequestHandler, Response } from "express";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "@bookwise/shared";
import { AppError } from "../../lib/errors";
import * as authService from "./auth.service";

const COOKIE_NAME = "session";

const readSessionToken = (req: Request) =>
  req.headers.cookie
    ?.split(";")
    .map((c) => c.trim().split("="))
    .find(([key]) => key === COOKIE_NAME)?.[1];

const setSessionCookie = (res: Response, { token, expiresAt }: authService.Session) =>
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
  });

export const register: RequestHandler = async (req, res) => {
  const { user, session } = await authService.register(req.body as RegisterInput);
  setSessionCookie(res, session);
  res.status(201).json(user);
};

export const login: RequestHandler = async (req, res) => {
  const { user, session } = await authService.login(req.body as LoginInput);
  setSessionCookie(res, session);
  res.json(user);
};

export const logout: RequestHandler = async (req, res) => {
  const token = readSessionToken(req);
  if (token) await authService.logout(token);
  res.clearCookie(COOKIE_NAME);
  res.status(204).end();
};

export const me: RequestHandler = async (req, res) => {
  const token = readSessionToken(req);
  if (!token) throw new AppError(401, "Unauthorized");
  res.json(await authService.getCurrentUser(token));
};

export const forgotPassword: RequestHandler = async (req, res) => {
  await authService.forgotPassword(req.body as ForgotPasswordInput);
  res.status(204).end();
};

export const resetPassword: RequestHandler = async (req, res) => {
  await authService.resetPassword(req.body as ResetPasswordInput);
  res.status(204).end();
};

export const verifyEmail: RequestHandler = async (req, res) => {
  await authService.verifyEmail(req.body as VerifyEmailInput);
  res.status(204).end();
};

export const resendVerification: RequestHandler = async (req, res) => {
  const token = readSessionToken(req);
  if (!token) throw new AppError(401, "Unauthorized");
  await authService.resendVerification(token);
  res.status(204).end();
};
