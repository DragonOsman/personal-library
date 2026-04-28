// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

"use client";

import { authClient } from "@/src/auth-client";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordSchema } from "@/src/utils/validation";

interface ResetPasswordProps {
  token: string
}

const getResetPasswordErrorMessage = (error: {
  code?: string;
  message?: string;
}) => {
  switch (error.code) {
    case "invalid_token":
    case "expired_token":
      return "This reset link is invalid or has expired. Please request a new one.";
    case "weak_password":
      return "Your password is too weak. Please choose a stronger one.";
    case "too_many_requests":
      return "Too many attempts. Please try again later.";
    default:
      return error.message || "Something went wrong. Please try again.";
  }
};

const ResetPassword = ({ token }: ResetPasswordProps) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [invalidToken, setInvalidToken] = useState<boolean>(false);

  const router = useRouter();

  if (invalidToken) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-md bg-white px-6 py-12 rounded-xl shadow-sm text-center">
          <h1 className="text-xl font-bold mb-4 text-red-500">
            Invalid or Expired Link
          </h1>
          <p className="mb-4">
            This password reset link is invalid or has expired.
          </p>
          <a href="/auth/reset-password-request" className="btn btn-primary">
            Request a new link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md bg-white px-6 py-12 rounded-xl shadow-sm">
        <h1 className="text-black">Reset Password</h1>
        <Formik
          initialValues={{ newPassword: "", confirmPassword: "" }}
          validationSchema={toFormikValidationSchema(resetPasswordSchema)}
          onSubmit={async (values, { setSubmitting }) => {
            const { data, error } = await authClient.resetPassword({
              newPassword: values.newPassword,
              token
            });
            if (error) {
              console.error(error);

              if (
                error.code === "invalid_token" ||
                error.code === "expired_token"
              ) {
                setInvalidToken(true);
                setSubmitting(false);
                return;
              }

              setErrorMessage(getResetPasswordErrorMessage(error));
              setSubmitting(false);
              return;
            } else if (data?.status) {
              setErrorMessage("");
              setSuccess("Password reset email sent successfully");

              setTimeout(() => {
                router.push("/auth/signin");
              }, 1500);
              setSubmitting(false);
              return;
            }
          }}
        >
          {({ errors, touched, isSubmitting, getFieldProps }) => (
            <Form className="flex flex-col gap-4">
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...getFieldProps("newPassword")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.newPassword && touched.newPassword ? (
                  <div className="alert alert-error text-sm mt-1">{errors.newPassword}</div>
                ) : null}
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...getFieldProps("confirmPassword")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.confirmPassword && touched.confirmPassword ? (
                  <div className="alert alert-error mt-1">{errors.confirmPassword}</div>
                ) : null}
              </div>
              {errorMessage && (
                <div className="alert alert-error mb-4">{errorMessage}</div>
              )}
              {success && (
                <div className="alert alert-success mb-4">{success}</div>
              )}
              <button
                type="submit"
                disabled={isSubmitting || !!success}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-offset-blue ${isSubmitting ? "disabled:opacity-50" : ""}`}
              >
                Reset Password
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;