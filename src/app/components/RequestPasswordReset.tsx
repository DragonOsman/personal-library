// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

"use client";

import { authClient } from "@/src/auth-client";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { requestPasswordReset } from "@/src/utils/validation";
import { useState } from "react";
import { useRouter } from "next/navigation";

const RequestPasswordReset = () => {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md bg-white px-6 py-12 rounded-xl shadow-sm">
        <h1 className="text-black">Request Password Reset</h1>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={toFormikValidationSchema(requestPasswordReset)}
          onSubmit={async (values, { setSubmitting }) => {
            const { data, error } = await authClient.requestPasswordReset({
              email: values.email,
              redirectTo: `${window.location.origin}/auth/reset-password`
            });
            if (error) {
              console.error(error);
              const { code, status, statusText, message } = error;
              setError(`
                Error requesting password reset.
                Code: ${code},
                Status: ${status},
                Status text: ${statusText},
                Message: ${message}
              `);
            } else if (data.status) {
              setError("");
              setSuccess("Password reset email sent successfully");

              setTimeout(() => {
                router.push("/auth/signin");
              }, 1500);
            }
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting, getFieldProps }) => (
            <Form className="RequestPasswordReset flex flex-col gap-4">
              <div className="emailGroup">
                <label htmlFor="email">Email:</label>
                <input
                   type="email"
                   {...getFieldProps("email")}
                   className={`w-full px-3 py-2 border rounded-md ${
                     touched.email && errors.email ? "border-red-500" : "border-gray-300"
                   }`}
                   id="email"
                   placeholder="Enter your email"
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
              >
                {isSubmitting ? "Submitting..." : "Send Reset Email"}
              </button>
              <div className={`${error ? "alert alert-error" : success ? "alert alert-success" : ""}`}>
                {error || success}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RequestPasswordReset;