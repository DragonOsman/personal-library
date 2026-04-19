// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

"use client";

import { Formik, Form } from "formik";
import { useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { authClient } from "@/src/auth-client";
import { signupSchema } from "@/src/utils/validation";
import { FaGoogle, FaGithub, FaDiscord, FaEnvelope } from "react-icons/fa";
import Card from "@/src/app/components/ui/Card";

export default function SignUp() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  return (
    <div className="flex justify-center">
      <Card>
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
        <Formik
          initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
          validationSchema={toFormikValidationSchema(signupSchema)}
          onSubmit={async (values) => {
            try {
              const { data, error } = await authClient.signUp.email({
                name: values.name,
                email: values.email,
                password: values.password,
                callbackURL: "/auth/signin"
              });

              if (data && data.user) {
                setSuccess("Registration successful! Redirecting to login page...");
                setError("");
              } else if (error) {
                setError(error.message || "Registration failed");
                setSuccess("");
              }
            } catch (err: unknown) {
              setError(`An error occurred: ${(err as Error).message}`);
            }

          }}
        >
         {({ handleSubmit, getFieldProps, touched, errors, isSubmitting, values }) => {
            return (
            <>
              <Form
                className="space-y-4 w-full"
                onSubmit={handleSubmit}
                method="post"
              >
                <div className="form-control">
                  <label className="label justify-start" htmlFor="name">
                    <span className="label-text">Full Name:</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...getFieldProps("name")}
                    className="input input-bordered w-full"
                  />
                  {touched.name && errors.name && (
                    <p className="text-error text-sm">{errors.name}</p>
                  )}
                </div>
                <div className="form-control w-full">
                  <label className="label justify-start" htmlFor="email">
                    <span className="label-text">Email:</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...getFieldProps("email")}
                    className="input input-bordered w-full"
                  />
                  {touched.email && errors.email && (
                    <p className="text-error text-sm">{errors.email}</p>
                  )}
                </div>
                <div className="form-control w-full">
                  <label className="label justify-start" htmlFor="password">
                    <span className="label-text">Password:</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    {...getFieldProps("password")}
                    className="input input-bordered w-full"
                  />
                  {touched.password && errors.password && (
                    <p className="text-error text-sm">{errors.password}</p>
                  )}
                </div>
                <div className="form-control w-full">
                  <label className="label justify-start" htmlFor="confirmPassword">
                    <span className="label-text">Confirm Password:</span>
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    {...getFieldProps("confirmPassword")}
                    className="input input-bordered w-full"
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <p className="text-error text-sm">{errors.confirmPassword}</p>
                  )}
                </div>

                {error !== "" && (
                  <p className="text-error text-sm">
                    {error}
                  </p>
                )}
                {success !== "" && (
                  <p className="text-success text-sm">
                    {success}
                  </p>
                )}

                <button
                  type="submit"
                  title="Submit"
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                  className="btn btn-primary w-full"
                >
                  {isSubmitting ? "Signing up..." : "Sign Up"}
                </button>
                <div className="text-sm space-y-1 text-center">
                  <p>
                    Already have an account? <a href="/auth/signin" className="link hover:link-hover" title="sign in">Sign in</a>.
                  </p>
                </div>
              </Form>
              <div className="divider">OR</div>
              <div className="space-y-2">
                <button
                  onClick={() => authClient.signIn.social({ provider: "google" })}
                  className="btn btn-outline w-full gap-2"
                  title="Google SignIn"
                  type="button"
                >
                  <FaGoogle className="text-base shrink-0" /> Continue with Google
                </button>

                <button
                  onClick={() => authClient.signIn.social({ provider: "github" })}
                  className="btn btn-primary w-full gap-2"
                  type="button"
                  title="GitHub SignIn"
                >
                  <FaGithub className="text-base shrink-0" /> Continue with GitHub
                </button>

                <button
                  className="btn btn-secondary w-full gap-2"
                  onClick={() => authClient.signIn.social({ provider: "discord" })}
                  type="button"
                  title="Discord Sign In"
                >
                  <FaDiscord className="text-base shrink-0" /> Continue with Discord
                </button>

                <button
                  onClick={() =>
                    authClient.signIn.magicLink({
                      email: values.email,
                      callbackURL: "/users/profile"
                    })
                  }
                  className="btn btn-ghost btn-outline w-full gap-2"
                  type="button"
                  title="Magic Link SignIn"
                >
                  <FaEnvelope className="text-base shrink-0" /> Magic Link
                </button>
              </div>
            </>
            );
          }}
        </Formik>
      </Card>
    </div>
  );
}