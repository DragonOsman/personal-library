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

interface AuthError {
  code?: string;
  message?: string;
  status: number;
  statusText: string;
}

const getSignupErrorMessage = (error: AuthError | null) => {
  switch (error?.code) {
    case "user_already_exists":
      return "An account with this email already exists. Please sign in or use a different email.";
    case "invalid_email":
    case "invalid_email_format":
    case "email_not_allowed":
      return "The email address is invalid. Please enter a valid email.";
    case "weak_password":
      return "The password is too weak. Please choose a stronger password.";
    case "too_many_requests":
      return "Too many registration attempts. Please try again later.";
    default:
      return `${error?.message}. Error status: ${error?.status}: ${error?.statusText}`;
  }
};

export default function SignUp() {
  const [customError, setCustomError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const socialBtn = "btn w-full justify-start gap-2";

  return (
    <div className="flex justify-center">
      <Card>
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
        <Formik
          initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
          validationSchema={toFormikValidationSchema(signupSchema)}
          onSubmit={async (values) => {
            setCustomError("");
            setSuccess("");

            try {
              const { data, error } = await authClient.signUp.email({
                name: values.name,
                email: values.email,
                password: values.password,
                callbackURL: "/auth/signin"
              });

              if (data && data.user) {
                setSuccess("Registration successful! Redirecting to login page...");
              } else if (error) {
                setCustomError(getSignupErrorMessage(error));
                return;
              }
            } catch (err: unknown) {
              setCustomError(`An error occurred: ${(err as Error).message}`);
            }
          }}
        >
         {({ getFieldProps, touched, errors, isSubmitting, values }) => {
            return (
            <>
              <Form className="space-y-4 w-full">
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

                {customError && (
                  <div className="alert alert-error">
                    {customError}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success">
                    {success}
                  </div>
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
                  className={`${socialBtn} btn-outline`}
                  title="Google SignIn"
                  type="button"
                >
                  <FaGoogle className="text-base shrink-0" /> Continue with Google
                </button>

                <button
                  onClick={() => authClient.signIn.social({ provider: "github" })}
                  className={`${socialBtn} btn-primary`}
                  type="button"
                  title="GitHub SignIn"
                >
                  <FaGithub className="text-base shrink-0" /> Continue with GitHub
                </button>

                <button
                  className={`${socialBtn} btn-secondary`}
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
                  className={`${socialBtn} btn-ghost btn-outline`}
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