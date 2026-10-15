import { create } from "zustand";
import type { AuthUser } from "@bookwise/shared";

type AuthState = {
  user: AuthUser | null;
  /** "loading" until the first /me check finishes */
  status: "loading" | "authenticated" | "anonymous";
  setUser: (user: AuthUser | null) => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  status: "loading",
  setUser: (user) => set({ user, status: user ? "authenticated" : "anonymous" }),
}));
