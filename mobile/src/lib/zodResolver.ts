import type { FieldErrors, Resolver } from "react-hook-form";
import type { ZodType } from "zod";

// Minimal react-hook-form resolver backed by Zod — avoids adding the
// @hookform/resolvers dependency. On success it returns the parsed (coerced)
// values; on failure it maps the first issue per field to an RHF FieldError.
export function zodResolver<T extends Record<string, unknown>>(
  schema: ZodType<T>,
): Resolver<T> {
  return async (values) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return { values: result.data, errors: {} };
    }

    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !errors[key]) {
        errors[key] = { type: issue.code, message: issue.message };
      }
    }

    return { values: {}, errors: errors as FieldErrors<T> };
  };
}
