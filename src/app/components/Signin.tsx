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
              if (error.message) {
                setCustomError(error.message);
              }
            }

            setSubmitting(false);
          }}
        >
          {({ handleSubmit, getFieldProps, touched, errors, isSubmitting, status, values }) => (
            <>
              <Form
                className="space-y-4 flex flex-col items-center"
                onSubmit={handleSubmit}
                method="post"
              >
                <div className="form-control">
                  <label className="label" htmlFor="email">
                    <span className="label-text">Email:</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...getFieldProps("email")}
                    className="input input-bordered w-full text-black caret-black bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  {touched.email && errors.email && (
                    <p className="text-error text-sm">{errors.email}</p>
                  )}
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="password">
                    <span className="label-text">Password:</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    {...getFieldProps("password")}
                    className="input input-bordered w-full text-black caret-black bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  {touched.password && errors.password && (
                    <p className="text-error text-sm">{errors.password}</p>
                  )}
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 text-sm" htmlFor="rememberMe">
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

                <div className="text-sm text-center space-y-1">
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
                {status && status.msg && status.msg !== "" && (
                  <p className="text-error text-sm text-center">{status.msg}</p>
                )}
                {customError !== "" && (
                  <p className="text-error text-sm text-center">{customError}</p>
                )}
              </Form>
              <div className="divider">OR</div>
              <div className="space-y-2 flex items-center gap-2 w-full flex-col">
                <button
                  onClick={() => authClient.signIn.social({ provider: "google" })}
                  className="btn btn-outline w-full gap-2 flex-row items-center"
                  title="Google SignIn"
                  type="button"
                >
                  <FaGoogle /> Continue with Google
                </button>

                <button
                  onClick={() => authClient.signIn.social({ provider: "github" })}
                  className="btn btn-primary w-full gap-2 flex-row items-center"
                  type="button"
                  title="GitHub SignIn"
                >
                  <FaGithub /> Continue with GitHub
                </button>

                <button
                  className="btn btn-secondary w-full gap-2 flex-row items-center"
                  onClick={() => authClient.signIn.social({ provider: "discord" })}
                  type="button"
                  title="Discord Sign In"
                >
                  <FaDiscord /> Continue with Discord
                </button>

                <button
                  onClick={() =>
                    authClient.signIn.magicLink({
                      email: values.email,
                      callbackURL: "/users/profile"
                    })
                  }
                  className="btn btn-ghost btn-outline w-full gap-2 flex-row items-center"
                  type="button"
                  title="Magic Link SignIn"
                >
                  <FaEnvelope /> Magic Link
                </button>
              </div>
            </>
          )}
        </Formik>
      </Card>
    </div>
  );
}