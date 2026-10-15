import { useResendVerification } from "../../auth/hooks";
import { useAuthStore } from "../../auth/store";
import { Button } from "../ui";

/** Reminds signed-in users with an unverified email to check their inbox. */
export const VerificationBanner = () => {
  const user = useAuthStore((s) => s.user);
  const resend = useResendVerification();
  if (!user || user.emailVerified) return null;

  return (
    <div
      role="status"
      className="flex flex-wrap items-center justify-between gap-3 bg-amber-50 px-4 py-3 text-sm text-amber-900"
    >
      <span>
        Please verify your email. We sent a link to <strong>{user.email}</strong>.
      </span>
      {resend.isSuccess ? (
        <span>New link sent.</span>
      ) : (
        <Button onClick={() => resend.mutate()} disabled={resend.isPending} className="!py-1">
          {resend.isPending ? "Sending…" : "Resend email"}
        </Button>
      )}
    </div>
  );
};
