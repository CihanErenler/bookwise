import type { ErrorRequestHandler } from "express";
import { AppError } from "../lib/errors";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.code });
  }
  // Client errors raised by Express itself, e.g. malformed JSON bodies
  if (typeof err?.status === "number" && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: "BadRequest" });
  }
  console.error(err);
  res.status(500).json({ error: "InternalError" });
};
