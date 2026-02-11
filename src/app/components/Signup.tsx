"use client";

import { Formik } from "formik";
import { useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { authClient } from "@/src/auth-client";
import { signupSchema } from "@/src/utils/validation";
import {  FaGoogle, FaGithub, FaEnvelope } from "react-icons/fa";

export default function SignUp() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md bg-white px-6 py-12 rounded-xl shadow-sm">
        <h1 className="text-black">Sign Up</h1>
        <Formik
          initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
          validationSchema={toFormikValidationSchema(signupSchema)}
          onSubmit={async (values) => {
            try {
              const { data, error } = await authClient.signUp.email({
                name: values.name,
                email: values.email,
                password: values.password,
                callbackURL: "/"
              });

              if (data && data.user) {
                setSuccess("Registration successful! Redirecting to profile page...");
                setError("");
              } else if (error) {
                setError(error.message || "Registration failed");
                setSuccess("");
              }
            } catch (err: unknown) {
              setError(`An error occurred: ${(err as Error).message}`);
            }

          }}
        >
         {({ handleSubmit, getFieldProps, touched, errors, status, isSubmitting }) => (
            <div className="SignUpContainer w-full max-w-md flex flex-col flex-1 justify-center">
              <form className="SignUp flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="fullNameGroup">
                  <label htmlFor="name">Full Name:</label>
                  <input
                    id="name"
                    type="text"
                    {...getFieldProps("name")}
                    className="border rounded p-2 w-full"
                  />
                  {touched.name && errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>
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
                <div className="confirmPasswordGroup">
                  <label htmlFor="confirmPassword">Confirm Password:</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    {...getFieldProps("confirmPassword")}
                    className="border rounded p-2 w-full"
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                  )}
                </div>

                {error !== "" && <div className="text-red-500 text-sm">{error}</div>}
                {status && (
                  <p className="text-red-500 text-sm">{status.msg}</p>
                )}
                {success && (
                  <p className="text-green-500 text-sm">{success}</p>
                )}

                <button
                  type="submit"
                  title="Submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white p-2 rounded disabled:opacity-50 hover:bg-blue-800"
                >
                  {isSubmitting ? "Signing up..." : "Sign Up"}
                </button>
                <p className="note">
                  Already have an account? <a href="/auth/signin" className="link hover:link-hover" title="sign in">Sign in</a>.
                </p>
              </form>
              <hr className="divider my-6" />
              <div className="socialSignIn flex flex-col gap-4">
                <button
                  title="Google SignIn"
                  type="button"
                  onClick={() => authClient.signIn.social({
                    provider: "google"
                  })}
                  className="bg-red-600 text-white items-center p-2 rounded hover:bg-red-800"
                >
                  <FaGoogle className="inline-block" /> Sign in with Google
                </button>
                <button
                  title="GitHub SignIn"
                  type="button"
                  onClick={() => authClient.signIn.social({
                    provider: "github"
                  })}
                  className="bg-gray-700 text-white p-2 items-center rounded hover:bg-black-900"
                >
                  <FaGithub className="inline-block" /> Sign in with GitHub
                </button>
                <button
                  type="button"
                  title="Email SignIn"
                  onClick={async () => {
                    const magicLinkOptions = {
                      email: getFieldProps("email").value,
                      callbackURL: "/users/profile"
                    };
                    const { error: err, data } = await authClient.signIn.magicLink(magicLinkOptions);
                    if (err) {
                      setError("Failed to send magic link");
                    }
                    if (data && data.status) {
                      alert("Link sent to  your email");
                    }
                  }}
                  className="bg-green-700 text-white items-center p-2 rounded hover:bg-green-800"
                >
                  <FaEnvelope className="inline-block" /> Sign in with Email
                </button>
              </div>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
}