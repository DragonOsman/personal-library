import { ZodSchema, ZodError } from "zod";

export const zodToFormikValidate = <T>(schema: ZodSchema<T>) => {
  return (values: T) => {
    try {
      schema.parse(values);
      return {};
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        const errors: Record<string, string> = {};
        for (const error of err.errors) {
          if (error.path.length > 0) {
            errors[error.path[0] as string] = error.message;
          }
        }
        return errors;
      }
      // If it's some other error, return a generic error
      return { _error: "Validation failed unexpectedly" };
    }
  };
};