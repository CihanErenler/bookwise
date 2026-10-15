import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { loginSchema } from "@bookwise/shared";
import { errorMessage, useLogin } from "../auth/hooks";
import { AuthLayout } from "../components/auth/AuthLayout";
import { FormError } from "../components/auth/FormError";
import { Button, Input, Link } from "../components/ui";
import { parseForm, type FieldErrors } from "../lib/forms";

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useLogin();
  const [errors, setErrors] = useState<FieldErrors>({});

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = parseForm(e.currentTarget, loginSchema);
    setErrors(parsed.errors ?? {});
    if (parsed.data) login.mutate(parsed.data, { onSuccess: () => navigate("/") });
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your Bookwise account.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <FormError message={login.isError ? errorMessage(login.error) : undefined} />
        <Input label="Email" type="email" name="email" autoComplete="email" error={errors.email} />
        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          error={errors.password}
        />
        <div className="flex justify-end">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <Button type="submit" disabled={login.isPending}>
          {login.isPending ? "Logging in…" : "Log in"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
