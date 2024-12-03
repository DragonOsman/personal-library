"use client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@/app/api/auth/register/register.css";
import { registerAction } from "@/app/actions/auth-actions";
import { registrationSchema } from "@/app/lib/definitions";
import { Button } from "@mui/material";
import { FormikValues, useFormik } from "formik";
import { FormEvent } from "react";

const RegisterForm = () => {
  const handleSubmit = (values: FormikValues) => {
    for (const [key, value] of Object.keys(values)) {
      console.log(`${key}:${value}`);
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    onSubmit: handleSubmit,
    validate: () => registrationSchema
  });

  return (
    <section className="register-container flex-col min-h-screen flex justify-center items-center">
      <h2>Create an account</h2>
      <form
        action={registerAction}
        className="flex w-full flex-col space-between"
      >
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          className="firstName rounded"
          required
          {...formik.getFieldProps("firstName")}
        />
        {formik.touched.firstName && formik.errors.firstName && (
          <p className="text-sm text-red-600">{formik.errors.firstName}</p>
        )}
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          className="lastName rounded"
          required
          {...formik.getFieldProps("lastName")}
        />
        {formik.touched.lastName && formik.errors.lastName && (
          <p className="text-sm text-red-600">{formik.errors.lastName}</p>
        )}
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          className="email rounded"
          required
          {...formik.getFieldProps("email")}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-sm text-red-600">{formik.errors.email}</p>
        )}
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          className="password rounded"
          required
          {...formik.getFieldProps("password")}
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-sm text-red-600">{formik.errors.password}</p>
        )}
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          className="confirmPassward rounded"
          required
          {...formik.getFieldProps("confirmPassword")}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="text-sm text-red-600">{formik.errors.confirmPassword}</p>
        )}
        <Button
          variant="contained"
          type="submit"
          disabled={formik.isSubmitting ? true : false}
        >
          Register
        </Button>
      </form>
    </section>
  );
};

export default RegisterForm;