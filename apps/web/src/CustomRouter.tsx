import { Routes, Route } from "react-router";
import { GuestRoute } from "./auth/GuestRoute";
import { useSession } from "./auth/hooks";
import { useAuthStore } from "./auth/store";
import {
  ForgotPasswordPage,
  LandingPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from "./pages";

export const CustomRouter = () => {
  useSession();
  const status = useAuthStore((s) => s.status);
  if (status === "loading") return null;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
    </Routes>
  );
};
