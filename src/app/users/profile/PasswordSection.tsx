"use client";

import { Formik, Form } from "formik";
import { useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { authClient } from "@/src/auth-client";
import { passwordField } from "@/src/utils/validation";
import { useRouter } from "next/navigation";

const PasswordSection = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { data, error } = authClient.useSession();
  if (data) {
    setMessage("Welcome to your profile's password-change section");
  } else if (error) {
    setErrorMessage(`Error: ${error.error}: ${error.message}`);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Change Password</h2>
      {message !== "" && <h3>{message}</h3>}
      {errorMessage !== "" && <p>{errorMessage}</p>}
      <Formik
        initialValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
        validationSchema={toFormikValidationSchema(passwordField)}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          setSubmitting(true);

          try {
            const { data, error } = await authClient.changePassword({
              newPassword: values.newPassword,
              currentPassword: values.currentPassword
            });

            if (data) {
              if (data.user) {
                setStatus({ msg: "Password changed successfully" });
                router.push("/users/profile");
              }
            } else if (error) {
              const { code, message, status, statusText } = error;
              if ((code && code !== "") && (message && message !== "") && status > 0 && statusText !== "") {
                setStatus({ msg: `Verification failed - Error Code: ${code} - ${message} (${status}: ${statusText})` });
              }
            }
          } catch (err) {
            setStatus({ msg: `Something went wrong: ${err}` });
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
            {status && status.msg && status.msg !== "" && (
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
    </div>
  );
};

export default PasswordSection;
