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
              email: values.email
            });
            if (error) {
              console.error(error);
              setError(error.message || "An error occurred. Please try again.");
            } else {
              const { status } = data;
              if (status) {
                setError("");
              }
              setSuccess("Password reset email sent successfully");
              router.push("/");
            }
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting, getFieldProps, handleSubmit }) => (
            <Form
              className="RequestPasswordReset flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              method="post"
            >
              <div className="emailGroup">
                <label htmlFor="email">Email:</label>
                <input
                   type="email"
                   {...getFieldProps("email")}
                   className={`w-full px-3 py-2 border rounded-md ${
                     touched.email && errors.email ? "border-red-500" : "border-gray-300"
                   }`}
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
              <p className="note">{error || success}</p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RequestPasswordReset;