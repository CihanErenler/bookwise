import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "./store";

/** Renders auth pages only for signed-out visitors. */
export const GuestRoute = () => {
  const status = useAuthStore((s) => s.status);
  if (status === "authenticated") return <Navigate to="/" replace />;
  return <Outlet />;
};
