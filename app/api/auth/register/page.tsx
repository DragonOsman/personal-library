import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./register.css";
import { useFormik } from "formik";
import { Button, TextField, Typography } from "@mui/material";
import { register } from "@/app/actions/register";
import { withZodSchema } from "formik-validator-zod";
import { registrationSchema } from "@/app/lib/definitions";

const FormPage = () => {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    onSubmit: async (values) => {
      console.log(values);
    },
    validate: withZodSchema(registrationSchema)
  });

  return (
    <section className="register-container min-w-full min-h-screen flex justify-center items-center">
      <form
        className="rounded-lg flex flex-col gap-4 items-center bg-gray-100 shadow-lg w-[400px] px-8 py-4 text-black"
        action={register}
        onSubmit={e => {
          //e.preventDefault();
          formik.handleSubmit();
        }}
      >
        <Typography variant="h6">Register</Typography>
        <TextField
          id="firstName"
          type="text"
          label="firstName"
          placeholder="First Name"
          fullWidth
          {...formik.getFieldProps("firstName")}
        />
        {formik.errors.firstName && formik.touched.firstName && (
          <p className="text-sm text-red-600 border-2 w-full bg-red-100 h-8 rounded-md flex justify-center items-center">
            {formik.errors.firstName}
          </p>
        )}
        <TextField
          id="lastName"
          type="text"
          label="lastName"
          placeholder="Last Name"
          fullWidth
          {...formik.getFieldProps("lastName")}
        />
        {formik.errors.lastName && formik.touched.lastName && (
          <p className="text-sm text-red-600 border-2 w-full bg-red-100 h-8 rounded-md flex justify-center items-center">
            {formik.errors.lastName}
          </p>
        )}
        <TextField
          id="email"
          type="email"
          label="Email"
          placeholder="johndoe@example.com"
          fullWidth
          {...formik.getFieldProps("email")}
        />
        {formik.errors.email && formik.touched.email && (
          <p className="text-sm text-red-600 border-2 w-full bg-red-100 h-8 rounded-md flex justify-center items-center">
            {formik.errors.email}
          </p>
        )}
        <TextField
          id="password"
          type="password"
          label="password"
          placeholder="Enter Password"
          fullWidth
          {...formik.getFieldProps("password")}
        />
        {formik.errors.password && formik.touched.password && (
          <p className="text-sm text-red-600 border-2 w-full bg-red-100 h-8 rounded-md flex justify-center items-center">
            {formik.errors.password}
          </p>
        )}
        <TextField
          id="confirmPassword"
          type="password"
          label="confirmPassword"
          placeholder="Confirm Password"
          fullWidth
          {...formik.getFieldProps("confirmPassword")}
        />
        {formik.errors.confirmPassword && formik.touched.confirmPassword && (
          <p className="text-sm text-red-600 border-2 w-full bg-red-100 h-8 rounded-md flex justify-center items-center">
            {formik.errors.confirmPassword}
          </p>
        )}
        <Button variant="contained" type="submit" fullWidth>
          Register
        </Button>
      </form>
    </section>
  );
};

export default FormPage;