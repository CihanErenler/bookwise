import { useState, type FormEvent } from "react";
import { forgotPasswordSchema } from "@bookwise/shared";
import { errorMessage, useForgotPassword } from "../auth/hooks";
import { AuthLayout } from "../components/auth/AuthLayout";
import { FormError } from "../components/auth/FormError";
import { Button, Input, Link } from "../components/ui";
import { parseForm, type FieldErrors } from "../lib/forms";

const ForgotPasswordPage = () => {
  const forgot = useForgotPassword();
  const [errors, setErrors] = useState<FieldErrors>({});

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = parseForm(e.currentTarget, forgotPasswordSchema);
    setErrors(parsed.errors ?? {});
    if (parsed.data) forgot.mutate(parsed.data);
  };

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset link."
    >
      {forgot.isSuccess ? (
        <p role="status" className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
          If an account exists for that email, a reset link is on its way.
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <FormError message={forgot.isError ? errorMessage(forgot.error) : undefined} />
          <Input
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            error={errors.email}
          />
          <Button type="submit" disabled={forgot.isPending}>
            {forgot.isPending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-gray-600">
        <Link to="/login">Back to log in</Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
