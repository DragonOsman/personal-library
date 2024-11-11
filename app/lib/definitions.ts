import { z } from "zod";

export const registrationSchema = z.object({
  firstName: z.string().min(2, "First name should be at least 2 characters long")
    .max(25, "Name should be at most 25 characters long"),
  lastName: z.string().min(2, "Last ame should be at least 2 characters long")
    .max(25, "Name should be at most 25 characters long"),
  email: z.string().email("Email must be a valid email address"),
  password: z.string().min(6, "Password should have at least 6 characters")
    .regex(/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/, {
      message: `Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character`
    }),
  confirmPassword: z.string()
})
  .refine(values => values.password === values.confirmPassword)
;

export type FormState =
| {
  errors?: {
    firstName?: string[],
    lastName?: string[],
    email?: string[],
    password?: string[],
    confirmPassword?: string[]
  },
  message?: string
};