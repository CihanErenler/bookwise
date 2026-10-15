import type { ZodType } from "zod";

export type FieldErrors = Partial<Record<string, string>>;

/** Validates a submitted form against a zod schema, returning data or per-field errors. */
export const parseForm = <T>(form: HTMLFormElement, schema: ZodType<T>) => {
  const result = schema.safeParse(Object.fromEntries(new FormData(form)));
  if (result.success) return { data: result.data };

  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const field = String(issue.path[0]);
    errors[field] ??= issue.message;
  }
  return { errors };
};
