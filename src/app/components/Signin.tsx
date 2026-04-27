// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

"use client";

import { authClient } from "@/src/auth-client";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useState } from "react";
import { signinSchema } from "@/src/utils/validation";
import { FaGoogle, FaGithub, FaDiscord, FaEnvelope } from "react-icons/fa";
import Card from "@/src/app/components/ui/Card";

export default function SignIn() {
  const [customError, setCustomError] = useState<string>("");

  const socialBtn = "btn w-full justify-start gap-2";

  return (
    <div className="flex justify-center">
      <Card>
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        <Formik
          initialValues={{ email: "", password: "", rememberMe: false }}
          validationSchema={toFormikValidationSchema(signinSchema)}
          onSubmit={async (values, { setSubmitting }) => {
            const { error } = await authClient.signIn.email({
              email: values.email,
              password: values.password,
              rememberMe: values.rememberMe
            });

            if (error) {
              console.error(error);
              const { code, message, status, statusText } = error;
              if (message || code || status || statusText) {
                setCustomError(
                  `
                    error code: ${code},
                    error message: ${message}
                    error status: ${status},
                    error status text: ${statusText}
                  `
                );
              }
            }

            setSubmitting(false);
          }}
        >
          {({ getFieldProps, touched, errors, isSubmitting, values }) => (
            <>
              <Form className="space-y-4">
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
                  <div className="w-full flex justify-center">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        id="rememberMe"
                        className="checkbox checkbox-sm"
                        {...getFieldProps("rememberMe")}
                        type="checkbox"
                      />
                        Remember Me
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  title="Sign In"
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                  className="btn btn-primary w-full"
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>

                <div className="text-center space-y-1">
                  <a href="/auth/reset-password-request" className="link">
                    Forgot password?
                  </a>
                  <p>
                    Don't have an account?{" "}
                    <a href="/auth/signup" className="link">
                      Sign up
                    </a>
                  </p>
                </div>
                {customError && (
                  <div className="alert alert-error">{customError}</div>
                )}
              </Form>
              <div className="divider">OR</div>
              <div className="space-y-2">
                <button
                  onClick={() => authClient.signIn.social({
                    provider: "google",
                    callbackURL: "/auth/handle/oauth?redirect=/users/profile"
                  })}
                  className={`${socialBtn} btn-outline`}
                  title="Google SignIn"
                  type="button"
                >
                  <FaGoogle className="text-base shrink-0" /> Continue with Google
                </button>

                <button
                  onClick={() => authClient.signIn.social({
                    provider: "github",
                    callbackURL: "/auth/handle/oauth?redirect=/users/profile"
                  })}
                  className={`${socialBtn} btn-primary`}
                  type="button"
                  title="GitHub SignIn"
                >
                  <FaGithub className="text-base shrink-0" /> Continue with GitHub
                </button>

                <button
                  className={`${socialBtn} btn-secondary`}
                  onClick={() => authClient.signIn.social({
                    provider: "discord",
                    callbackURL: "/auth/handle/oauth?redirect=/users/profile"
                  })}
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
          )}
        </Formik>
      </Card>
    </div>
  );
}