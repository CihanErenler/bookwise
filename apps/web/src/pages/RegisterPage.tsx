import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { registerSchema } from "@bookwise/shared";
import { errorMessage, useRegister } from "../auth/hooks";
import { AuthLayout } from "../components/auth/AuthLayout";
import { FormError } from "../components/auth/FormError";
import { Button, Checkbox, Input, Link } from "../components/ui";
import { parseForm, type FieldErrors } from "../lib/forms";

const RegisterPage = () => {
  const navigate = useNavigate();
  const register = useRegister();
  const [errors, setErrors] = useState<FieldErrors>({});

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const parsed = parseForm(form, registerSchema);
    const formData = new FormData(form);
    const fieldErrors: FieldErrors = { ...parsed.errors };
    if (formData.get("password") !== formData.get("confirmPassword")) {
      fieldErrors.confirmPassword = "Passwords do not match.";
    }
    if (!formData.get("terms")) {
      fieldErrors.terms = "You must accept the terms.";
    }
    setErrors(fieldErrors);
    if (parsed.data && Object.keys(fieldErrors).length === 0) {
      register.mutate(parsed.data, { onSuccess: () => navigate("/") });
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start using Bookwise today.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <FormError message={register.isError ? errorMessage(register.error) : undefined} />
        <Input label="Name" type="text" name="name" autoComplete="name" error={errors.name} />
        <Input label="Email" type="email" name="email" autoComplete="email" error={errors.email} />
        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          error={errors.password}
        />
        <Input
          label="Confirm password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          error={errors.confirmPassword}
        />
        <div>
          <Checkbox label="I agree to the terms and conditions" name="terms" />
          {errors.terms && <p className="mt-1.5 text-sm text-red-600">{errors.terms}</p>}
        </div>
        <Button type="submit" disabled={register.isPending}>
          {register.isPending ? "Creating account…" : "Register"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
