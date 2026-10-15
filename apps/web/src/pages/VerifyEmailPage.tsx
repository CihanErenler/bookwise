import { useParams } from "react-router";
import { errorMessage, useResendVerification, useVerifyEmail } from "../auth/hooks";
import { useAuthStore } from "../auth/store";
import { AuthLayout } from "../components/auth/AuthLayout";
import { FormError } from "../components/auth/FormError";
import { Button, Link } from "../components/ui";

const VerifyEmailPage = () => {
  const { token = "" } = useParams();
  const verify = useVerifyEmail(token);
  const resend = useResendVerification();
  const signedIn = useAuthStore((s) => s.status === "authenticated");

  return (
    <AuthLayout title="Verify email">
      {verify.isPending && <p className="text-sm text-gray-600">Verifying your email…</p>}
      {verify.isSuccess && (
        <p role="status" className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
          Your email has been verified.
        </p>
      )}
      {verify.isError && (
        <div className="flex flex-col gap-4">
          <FormError message={errorMessage(verify.error)} />
          {signedIn &&
            (resend.isSuccess ? (
              <p role="status" className="text-sm text-green-800">
                A new verification link is on its way.
              </p>
            ) : (
              <Button onClick={() => resend.mutate()} disabled={resend.isPending}>
                {resend.isPending ? "Sending…" : "Send a new link"}
              </Button>
            ))}
        </div>
      )}
      <p className="mt-6 text-center text-sm text-gray-600">
        <Link to={signedIn ? "/" : "/login"}>{signedIn ? "Continue" : "Back to log in"}</Link>
      </p>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
