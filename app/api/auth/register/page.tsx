import RegisterForm from "./RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register"
};

const RegisterPage = ()  => {
  return (
    <RegisterForm />
  );
};

export default RegisterPage;