import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./register.css";
import { Button, TextField, Typography } from "@mui/material";
import { register } from "@/app/actions/register";
import { withZodSchema } from "formik-validator-zod";
import { registrationSchema } from "@/app/lib/definitions";
import * as Yup from "yup";

const FormPage = () => {


  return (
    <section className="register-container min-w-full min-h-screen flex justify-center items-center">
      <form
        className="rounded-lg flex flex-col gap-4 items-center bg-gray-100 shadow-lg w-[400px] px-8 py-4 text-black"
        action={register}

      >
        <Typography variant="h6">Register</Typography>
        <label htmlFor="firstName">First Name</label>:
        <input
          type="text"
          id="firstName"
          placeholder="First Name"
          className="w-full rounded"
          required
          name="firstName"
        />
        <label htmlFor="lastName">Last Name</label>:
        <input
          id="lastName"
          type="text"
          placeholder="Last Name"
          className="w-full rounded"
          required
          name="lastName"
        />
        <label htmlFor="email">Email</label>:
        <input
          id="email"
          type="email"
          placeholder="johndoe@example.com"
          className="w-full rounded"
          required
          name="email"
        />
        <label htmlFor="password">Password</label>:
        <input
          id="password"
          type="password"
          placeholder="Enter Password"
          className="w-full rounded"
          required
          name="password"
        />
        <label htmlFor="confirmPassword">Confirm Password</label>:
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          className="w-full rounded"
          required
          name="confirmPassword"
        />
        <input type="submit" className="w-full rounded" value="Register" />
      </form>
    </section>
  );
};

export default FormPage;