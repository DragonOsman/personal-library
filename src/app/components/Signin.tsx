"use client";

import { authClient } from "@/auth-client";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useRouter } from "next/navigation";
import { z } from "zod";

export default function SignIn() {
  const validationSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100)
  });

  const router = useRouter();

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md bg-white px-6 py-12 rounded-xl shadow-sm">
        <Formik
          initialValues={{ email: "", password: "", rememberMe: false }}
          validationSchema={toFormikValidationSchema(validationSchema)}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            const res = await authClient.signIn.email({
              email: values.email,
              password: values.password,
              rememberMe: values.rememberMe
            });

            if (res?.error) {
              console.error(res.error);
              setErrors({ email: "Invalid email or password" });
            } else {
              router.push("/");
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
                <input
                  id="rememberMe"
                  className="m-2"
                  {...getFieldProps("rememberMe")}
                  type="checkbox"
                />
              </div>

              <button
                type="submit"
                title="Sign In"
                disabled={isSubmitting}
                className="bg-blue-500 text-white p-2 rounded disabled:opacity-50 hover:bg-blue-600"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
              <p className="note">
                Don't have an account? <a href="/auth/signup" title="sign up">Sign up</a>.
              </p>
            </Form>
          )}
        </Formik>
        <hr className="divider my-6" />
        <div className="socialSignIn flex flex-col gap-4">
          <button
            title="Google SignIn"
            type="button"
            onClick={() => authClient.signIn.social({
              provider: "google"
            })}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Sign in with Google
          </button>
          <button
            title="GitHub SignIn"
            type="button"
            onClick={() => authClient.signIn.social({
              provider: "github"
            })}
            className="bg-gray-900 text-white p-2 rounded hover:bg-black-600"
          >
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}