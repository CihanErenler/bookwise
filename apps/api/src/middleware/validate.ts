import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validateBody =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "ValidationError",
        issues: result.error.issues,
      });
    }
    req.body = result.data;
    next();
  };
