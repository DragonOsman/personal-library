import RegisterForm from "@/app/api/auth/register/RegisterForm";
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