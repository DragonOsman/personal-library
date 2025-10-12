"use client";

import { Formik } from "formik";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { signIn } from "next-auth/react";
import { signUpUser } from "../actions/signUpUser";
import { z } from "zod";

export default function SignUp() {
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const validationSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(11),
    confirmPassword: z.string().min(6).max(11)
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white dark:bg-gray-800">
      <Formik
        initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
        validationSchema={toFormikValidationSchema(validationSchema)}
        onSubmit={async (values) => {
          const formData = new FormData();
          formData.append("fullName", values.name);
          formData.append("email", values.email);
          formData.append("password", values.password);
          try {
            const res = await signUpUser(formData);

            if (res?.success) {
              const signInRes = await signIn("credentials", {
                redirect: false,
                email: values.email,
                password: values.password
              });
              if (signInRes?.error) {
                setError("Sign in after registration failed");
              } else {
                router.push("/");
              }
            } else {
              setError(res?.message || "Registration failed");
            }
          } catch (err: unknown) {
            setError(`An error occurred: ${(err as Error).message}`);
          }

        }}
      >
        {({ handleSubmit, getFieldProps, touched, errors, status, isSubmitting }) => (
          <div className="SignUpContainer w-full max-w-md flex flex-col flex-1 justify-center">
            <form className="SignUp flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="fullNameGroup">
                <label htmlFor="name">Full Name:</label>
                <input
                  id="name"
                  type="text"
                  {...getFieldProps("name")}
                  className="border rounded p-2 w-full"
                />
                {touched.name && errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
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
                  <p className="text-red-500 text-sm">{errors.email}</p>
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
                  <p className="text-red-500 text-sm">{errors.password}</p>
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
                  <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}
              {status && (
                <p className="text-red-500 text-sm">{status.msg}</p>
              )}

              <button
                type="submit"
                title="Submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white p-2 rounded disabled:opacity-50 hover:bg-blue-600"
              >
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </button>
              <p className="note">
                Already have an account? <a href="/auth/signin" title="sign in">Sign in</a>.
              </p>
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