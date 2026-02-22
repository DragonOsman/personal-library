"use client";

import { authClient } from "@/src/auth-client";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordSchema } from "@/src/utils/validation";

interface ResetPasswordProps {
  params: {
    token?: string;
  }
}

const ResetPassword = async ({ params }: ResetPasswordProps) => {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();

  if (!params.token) {
    const newParams = new URLSearchParams(window.location.search);
    const tokenFromQuery = newParams.get("token");
    params.token = tokenFromQuery || undefined;
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
              token: params.token
            });
            if (error) {
              console.error(error);
              setError(error.message || "An error occurred. Please try again.");
            } else {
              const { status } = data;
              if (status) {
                setError("");
              }
              setSuccess("Password reset successfully");
              router.push("/");
            }
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting, getFieldProps }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...getFieldProps("newPassword")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.newPassword && touched.newPassword ? (
                  <div className="text-red-500 text-sm mt-1">{errors.newPassword}</div>
                ) : null}
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...getFieldProps("confirmPassword")}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.confirmPassword && touched.confirmPassword ? (
                  <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>
                ) : null}
              </div>
              {error && (
                <div className="text-red-500 text-sm mb-4">{error}</div>
              )}
              {success && (
                <div className="text-green-500 text-sm mb-4">{success}</div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-offset-blue ${isSubmitting ? "opacity-disabled" : ""}`}
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