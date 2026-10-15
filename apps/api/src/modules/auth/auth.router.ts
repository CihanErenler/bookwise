import { Router } from "express";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "@bookwise/shared";
import { validateBody } from "../../middleware/validate";
import * as controller from "./auth.controller";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), controller.register);
authRouter.post("/login", validateBody(loginSchema), controller.login);
authRouter.post("/logout", controller.logout);
authRouter.get("/me", controller.me);
authRouter.post("/forgot-password", validateBody(forgotPasswordSchema), controller.forgotPassword);
authRouter.post("/reset-password", validateBody(resetPasswordSchema), controller.resetPassword);
authRouter.post("/verify-email", validateBody(verifyEmailSchema), controller.verifyEmail);
authRouter.post("/resend-verification", controller.resendVerification);
