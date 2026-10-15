import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AuthUser,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "@bookwise/shared";
import { api, ApiError } from "../lib/api";
import { useAuthStore } from "./store";

/** Checks the session cookie once on startup and mirrors the result into the auth store. */
export const useSession = () => {
  const setUser = useAuthStore((s) => s.setUser);
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const user = await api<AuthUser>("/auth/me");
        setUser(user);
        return user;
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          setUser(null);
          return null;
        }
        throw err;
      }
    },
    retry: false,
    staleTime: Infinity,
  });
};

export const useLogin = () => {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (input: LoginInput) => api<AuthUser>("/auth/login", { body: input }),
    onSuccess: setUser,
  });
};

export const useRegister = () => {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (input: RegisterInput) => api<AuthUser>("/auth/register", { body: input }),
    onSuccess: setUser,
  });
};

export const useLogout = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api("/auth/logout", { method: "POST" }),
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
    },
  });
};

export const useForgotPassword = () =>
  useMutation({
    mutationFn: (input: ForgotPasswordInput) => api("/auth/forgot-password", { body: input }),
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: (input: ResetPasswordInput) => api("/auth/reset-password", { body: input }),
  });

const ERROR_MESSAGES: Record<string, string> = {
  EmailTaken: "An account with this email already exists.",
  InvalidCredentials: "Invalid email or password.",
  InvalidOrExpiredToken: "This reset link is invalid or has expired.",
};

export const errorMessage = (err: unknown) =>
  (err instanceof ApiError && ERROR_MESSAGES[err.code]) || "Something went wrong. Please try again.";
