"use client";

import { authClient } from "@/src/auth-client";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signinSchema } from "@/src/utils/validation";
import {  FaGoogle, FaGithub, FaEnvelope } from "react-icons/fa";

export default function SignIn() {
  const [error, setError] = useState<string>("");
  const router = useRouter();

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md bg-white px-6 py-12 rounded-xl shadow-sm">
        <h1 className="text-black">Sign In</h1>
        <Formik
          initialValues={{ email: "", password: "", rememberMe: false }}
          validationSchema={toFormikValidationSchema(signinSchema)}
          onSubmit={async (values, { setSubmitting }) => {
            const { data, error } = await authClient.signIn.email({
              email: values.email,
              password: values.password,
              rememberMe: values.rememberMe
            });

            if (error) {
              console.error(error);
              if (error.message) {
                setError(error.message);
              }
            } else if (data && data.user) {
              router.push("/");
              setError("");
            }

            setSubmitting(false);
          }}
        >
          {({ handleSubmit, getFieldProps, touched, errors, isSubmitting, status, values }) => (
            <>
              <Form
                className="Signin flex flex-col gap-4"
                onSubmit={handleSubmit}
                method="post"
              >
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
                  <label htmlFor="rememberMe">Remember Me: </label>
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
                  className="bg-blue-600 text-white p-2 rounded disabled:opacity-50 hover:bg-blue-800"
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
                <p className="note">
                  Don't have an account? <a href="/auth/signup" className="link hover:link-hover" title="sign up">Sign up</a>.
                </p>
                {status && status.msg && status.msg !== "" && (
                  <p className="text-red-500 text-sm">{status.msg}</p>
                )}
                {error !== "" && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
              </Form>
              <hr className="divider my-6" />
              <div className="socialSignIn flex flex-col gap-4">
                <button
                  title="Google SignIn"
                  type="button"
                  onClick={() => authClient.signIn.social({
                    provider: "google"
                  })}
                  className="bg-red-600 items-center text-white p-2 rounded hover:bg-red-800"
                >
                  <FaGoogle className="inline-block" /> Sign in with Google
                </button>
                <button
                  title="GitHub SignIn"
                  type="button"
                  onClick={() => authClient.signIn.social({
                    provider: "github"
                  })}
                  className="bg-gray-700 items-center text-white p-2 rounded hover:bg-black-900"
                >
                  <FaGithub className="inline-block" /> Sign in with GitHub
                </button>
                <button
                  title="Email SignIn"
                  type="button"
                  onClick={() => authClient.signIn.magicLink({
                    email: values.email,
                    callbackURL: "/users/profile"
                  })}
                  className="bg-green-700 items-center text-white p-2 rounded hover:bg-black-800"
                >
                  <FaEnvelope className="inline-block" /> Sign in with Email
                </button>
              </div>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
}