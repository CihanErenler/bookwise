import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { resetPasswordSchema } from "@bookwise/shared";
import { errorMessage, useResetPassword } from "../auth/hooks";
import { AuthLayout } from "../components/auth/AuthLayout";
import { FormError } from "../components/auth/FormError";
import { Button, Input, Link } from "../components/ui";
import { parseForm, type FieldErrors } from "../lib/forms";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const token = useSearchParams()[0].get("token");
  const reset = useResetPassword();
  const [errors, setErrors] = useState<FieldErrors>({});

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const parsed = parseForm(form, resetPasswordSchema);
    const fieldErrors: FieldErrors = { ...parsed.errors };
    if (new FormData(form).get("password") !== new FormData(form).get("confirmPassword")) {
      fieldErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(fieldErrors);
    if (parsed.data && Object.keys(fieldErrors).length === 0) {
      reset.mutate(parsed.data, { onSuccess: () => navigate("/login") });
    }
  };

  return (
    <AuthLayout title="Reset password" subtitle="Choose a new password for your account.">
      {token ? (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <FormError message={reset.isError ? errorMessage(reset.error) : undefined} />
          <input type="hidden" name="token" value={token} />
          <Input
            label="New password"
            type="password"
            name="password"
            autoComplete="new-password"
            error={errors.password}
          />
          <Input
            label="Confirm new password"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            error={errors.confirmPassword}
          />
          <Button type="submit" disabled={reset.isPending}>
            {reset.isPending ? "Resetting…" : "Reset password"}
          </Button>
        </form>
      ) : (
        <FormError message="This reset link is missing its token. Request a new one." />
      )}
      <p className="mt-6 text-center text-sm text-gray-600">
        <Link to="/login">Back to log in</Link>
      </p>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
