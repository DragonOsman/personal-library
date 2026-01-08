import { z as zod } from "zod";

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,100}$/;

export const passwordField = zod
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(100, "Password must be at most 100 characters long")
  .regex(
    passwordRegex,
    "Password must contain at least one uppercase letter, "+
    "one lowercase letter, one number, and one special character"
  )
;

export const signupSchema = zod.object({
  name: zod.string().min(2, "Name is too short").max(100, "Name is too long"),
  email: zod.string().email("Invalid email address"),
  password: passwordField,
  confirmPassword: passwordField
})
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  })
;

export const signinSchema = zod.object({
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(8).max(100),
  rememberMe: zod.boolean().optional()
});

export const changePasswordSchema = zod.object({
  currentPassword: passwordField,
  newPassword: passwordField,
  confirmNewPassword: passwordField
})
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"]
  })
;