"use client";

import { signIn } from "../../auth";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import zod from "zod";

export function SignIn() {
  const validationSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6).max(11)
  });

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white dark:bg-gray-800">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={toFormikValidationSchema(validationSchema)}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          const res = await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password
          });

          if (res?.error) {
            console.error(res.error);
            setErrors({ email: "Invalid email or password" });
          } else {
            window.location.href = "/";
          }

          setSubmitting(false);
        }}
      >
        {({ handleSubmit, getFieldProps, touched, errors, isSubmitting, status }) => (
          <Form
            className="Signin flex flex-col gap-4"
            onSubmit={handleSubmit}
            method="post"
          >
            {status && status.msg && (
              <p className="text-red-500 text-sm">{status.msg}</p>
            )}
            <div className="emailGroup">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                {...getFieldProps("email")}
                className="border rounded p-2 w-full"
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div className="passwordGroup">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                {...getFieldProps("password")}
                className="border rounded p-2 w-full"
              />
              {touched.password && errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              title="Sign In"
              disabled={isSubmitting}
              className="bg-blue-500 text-white p-2 rounded disabled:opacity-50 hover:bg-blue-600"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </Form>
        )}
      </Formik>
      <hr className="divider my-6" />
      <div className="socialSignIn flex flex-col gap-4">
        <button
          title="Google SignIn"
          type="button"
          onClick={() => signIn("google")}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Sign in with Google
        </button>
        <button
          title="GitHub SignIn"
          type="button"
          onClick={() => signIn("github")}
          className="bg-black-500 text-white p-2 rounded hover:bg-black-600"
        >
          Sign in with GitHub
        </button>
        <button
          type="button"
          title="Email SignIn"
          onClick={() => signIn("email")}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Sign in with Email
        </button>
      </div>
    </div>
  );
}