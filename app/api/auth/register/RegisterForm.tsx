"use client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@/app/api/auth/register/register.css";
import { registerAction } from "@/app/actions/register";
import { registrationSchema } from "@/app/lib/definitions";
import { Button } from "@mui/material";
import { FormikValues, Formik, Form, Field, useFormikContext } from "formik";

const RegisterForm = () => {
  const { isSubmitting, setSubmitting } = useFormikContext();
  const handleSubmit = (values: FormikValues) => {
    setSubmitting(false);
    for (const [key, value] of Object.keys(values)) {
      console.log(`${key}:${value}`);
    }
  };

  return (
    <section className="register-container flex-col min-h-screen flex justify-center items-center">
      <h2>Create an account</h2>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: ""
        }}
        onSubmit={handleSubmit}
        validate={() => registrationSchema}
      >
        {({ errors, touched, getFieldProps }) => (
          <Form
            action={registerAction}
            className="flex w-full flex-col space-between"
          >
            <label htmlFor="firstName">First Name:</label>
            <Field
              type="text"
              id="firstName"
              className="firstName rounded"
              required
              {...getFieldProps("firstName")}
            />
            {touched.firstName && errors.firstName && (
              <p className="text-sm text-red-600">{errors.firstName}</p>
            )}
            <label htmlFor="lastName">Last Name:</label>
            <Field
              type="text"
              id="lastName"
              className="lastName rounded"
              required
              {...getFieldProps("lastName")}
            />
            {touched.lastName && errors.lastName && (
              <p className="text-sm text-red-600">{errors.lastName}</p>
            )}
            <label htmlFor="email">Email:</label>
            <Field
              type="email"
              id="email"
              className="email rounded"
              required
              {...getFieldProps("email")}
            />
            {touched.email && errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
            <label htmlFor="password">Password:</label>
            <Field
              type="password"
              id="password"
              className="password rounded"
              required
              {...getFieldProps("password")}
            />
            {touched.password && errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <Field
              type="password"
              id="confirmPassword"
              className="confirmPassward rounded"
              required
              {...getFieldProps("confirmPassword")}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting ? true : false}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default RegisterForm;