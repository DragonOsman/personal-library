"use client";

import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import prisma from "../../lib/db";
import bcrypt from "bcryptjs";
import zod from "zod";
import { useSession } from "next-auth/react";
import { useState } from "react";

export const PasswordSection = () => {
  const validationSchema = zod.object({
    currentPassword: zod.string().min(6).max(11),
    newPassword: zod.string().min(6).max(11),
    confirmPassword: zod.string().min(6).max(11)
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

  const {data: session} = useSession();
  const [success, setSuccess] = useState<string | null>(null);

  if (session?.user) {
    return null;
  }
  const userId = session?.user?.id;

  return (
    <section id="password">
      <h2 className="text-xl font-semibold">Change Password</h2>
      <Formik
        initialValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
        validationSchema={toFormikValidationSchema(validationSchema)}
        onSubmit={async (values, { setErrors, setSubmitting }) => {
          setSubmitting(true);

          try {
            const response = await fetch("/api/auth/change-password", {
              method: "POST",
              body: JSON.stringify({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword
              })
            });

            if (response.ok) {
              setSuccess("Password changed successfully");
            } else {
              const data = await response.json();
              setErrors({ currentPassword: data.error ?? "Password change failed" });
            }
          } catch {
            setErrors({ currentPassword: "Unexpected error" });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleSubmit, getFieldProps, touched, errors, isSubmitting, status }) => (
          <Form
            className="changePasswordForm flex flex-col gap-4"
            onSubmit={handleSubmit}
            method="post"
          >
            {status && status.msg && (
              <div className="text-red-500 text-sm">{status.msg}</div>
            )}
            <input
              type="password"
              {...getFieldProps("currentPassword")}
              className="border rounded p-2 w-full"
            />
            {touched.currentPassword && errors.currentPassword && (
              <p className="text-red-500 text-sm">{errors.currentPassword}</p>
            )}
            <input
              type="password"
              {...getFieldProps("newPassword")}
              className="border rounded p-2 w-full"
            />
            {touched.newPassword && errors.newPassword && (
              <p className="text-red-500 text-sm">{errors.newPassword}</p>
            )}
            <input
              type="password"
              {...getFieldProps("confirmPassword")}
              className="border rounded p-2 w-full"
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
            <button
              type="submit"
              title="Change password"
              className="bg-blue-500 text-white p-2 rounded disabled:opacity-50 hover:bg-blue-600"
            >
              {isSubmitting ? "Changing password..." : "Change password"}
            </button>

            {success && <p className="text-green-500 text-sm">{success}</p>}
          </Form>
        )}
      </Formik>
    </section>
  );
};