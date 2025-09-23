"use client";

import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import zod from "zod";

const PasswordSection = () => {
  const validationSchema = zod.object({
    currentPassword: zod.string().min(6).max(100),
    newPassword: zod.string().min(6).max(100),
    confirmPassword: zod.string().min(6).max(100)
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

  return (
    <section id="password">
      <h2 className="text-xl font-semibold">Change Password</h2>
      <Formik
        initialValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
        validationSchema={toFormikValidationSchema(validationSchema)}
        onSubmit={async (values, { setErrors, setSubmitting, setStatus }) => {
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
              setStatus({ msg: "Password changed successfully" });
            } else {
              const resData = await response.json();
              setStatus({ msg: resData.message ?? "Password change failed" });
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
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default PasswordSection;
