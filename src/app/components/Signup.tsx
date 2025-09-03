"use client";

import { Formik, Form } from "formik";
import { useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { signIn } from "../../auth";
import prisma  from "../lib/db";
import bcrypt from "bcryptjs";
import zod from "zod";

const signUpUser = async (formData: FormData) => {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  if (!email || !password || !fullName) {
    throw new Error("Missing required fields");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.users.create({
    data: {
      id: crypto.randomUUID(),
      email,
      fullName: fullName,
      hashedPassword: hashedPassword
    }
  });
  return { success: true, message: "User registered successfully", user };
};

export function SignUp() {
  const [error, setError] = useState<string>("");
  const validationSchema = zod.object({
    fullName: zod.string().min(2).max(50),
    email: zod.string().email(),
    password: zod.string().min(6).max(11),
    confirmPassword: zod.string().min(6).max(11)
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match"
  });

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white dark:bg-gray-800">
      <Formik
        initialValues={{ fullName: "", email: "", password: "", confirmPassword: "" }}
        validationSchema={toFormikValidationSchema(validationSchema)}
        onSubmit={async (values, { setSubmitting }) => {
          const res = await signUpUser(new FormData(Object.entries(values) as any));
          if (res?.success) {
            const signInRes = await signIn("credentials", {
              redirect: false,
              email: values.email,
              password: values.password
            });
            if (signInRes?.error) {
              setError("Sign in after registration failed");
            } else {
              window.location.href = "/";
            }
          } else {
            setError(res?.message || "Registration failed");
          }
        }}
      >
        {({ handleSubmit, getFieldProps, touched, errors, status, isSubmitting }) => (
          <div className="SignUpContainer w-full max-w-md flex flex-col flex-1 justify-center">
            <form className="SignUp flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="fullNameGroup">
                <label htmlFor="fullName">Full Name:</label>
                <input
                  id="fullName"
                  type="text"
                  {...getFieldProps("fullName")}
                  className="border rounded p-2 w-full"
                />
                {touched.fullName && errors.fullName && (
                  <div className="text-red-500 text-sm">{errors.fullName}</div>
                )}
              </div>
              <div className="emailGroup">
                <label htmlFor="email">Email:</label>
                <input
                  id="email"
                  type="email"
                  {...getFieldProps("email")}
                  className="border rounded p-2 w-full"
                />
                {touched.email && errors.email && (
                  <div className="text-red-500 text-sm">{errors.email}</div>
                )}
              </div>
              <div className="passwordGroup">
                <label htmlFor="password">Password:</label>
                <input
                  id="password"
                  type="password"
                  {...getFieldProps("password")}
                  className="border rounded p-2 w-full"
                />
                {touched.password && errors.password && (
                  <div className="text-red-500 text-sm">{errors.password}</div>
                )}
              </div>
              <div className="confirmPasswordGroup">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...getFieldProps("confirmPassword")}
                  className="border rounded p-2 w-full"
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <div className="text-red-500 text-sm">{errors.confirmPassword}</div>
                )}
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}
              {status && (
                <div className="text-red-500 text-sm">{status.msg}</div>
              )}

              <button
                type="submit"
                title="Submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white p-2 rounded disabled:opacity-50 hover:bg-blue-600"
              >
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </button>
            </form>
            <hr className="divider my-6" />
            <div className="socialSignIn flex flex-col gap-4">
              <button
                title="Google SignIn"
                type="button"
                onClick={() => signIn("google")}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Sign in with Google
              </button>
              <button
                title="GitHub SignIn"
                type="button"
                onClick={() => signIn("github")}
                className="bg-red-500 text-white p-2 rounded hover:bg-black-600"
              >
                Sign in with GitHub
              </button>
              <button
                type="button"
                title="Email SignIn"
                onClick={() => signIn("email")}
                className="bg-red-500 text-white p-2 rounded hover:bg-green-600"
              >
                Sign in with Email
              </button>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}