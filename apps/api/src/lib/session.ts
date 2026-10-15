import type { Request, Response } from "express";
import { and, eq, gt } from "drizzle-orm";
import { db } from "../db";
import { sessions, users } from "../db/schema";
import { generateToken, hashToken } from "./crypto";

const COOKIE_NAME = "session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const readCookie = (req: Request, name: string) =>
  req.headers.cookie
    ?.split(";")
    .map((c) => c.trim().split("="))
    .find(([key]) => key === name)?.[1];

export const createSession = async (res: Response, userId: string) => {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db
    .insert(sessions)
    .values({ tokenHash: hashToken(token), userId, expiresAt });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
  });
};

export const destroySession = async (req: Request, res: Response) => {
  const token = readCookie(req, COOKIE_NAME);
  if (token) {
    await db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token)));
  }
  res.clearCookie(COOKIE_NAME);
};

export const getSessionUser = async (req: Request) => {
  const token = readCookie(req, COOKIE_NAME);
  if (!token) return null;
  const [row] = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(
      and(
        eq(sessions.tokenHash, hashToken(token)),
        gt(sessions.expiresAt, new Date()),
      ),
    );
  return row ?? null;
};
