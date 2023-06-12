import "./Register.css";
import { useNavigate } from "react-router-dom";
import { useEffect, FormEvent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  event?: FormEvent<HTMLFormElement>;
}

const Register = () => {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(20, "Must be at most 20 characters")
        .required("This is a required field"),
      lastName: Yup.string()
        .max(20, "Must be at most 20 characters")
        .required("This is a required field"),
      email: Yup.string()
        .email("Invalid email address")
        .required("This is a required field"),
      password: Yup.string()
        .min(6, "Must be at least 6 characters")
        .required("This is a required field"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("This is a required field")
    }),
    onSubmit: async (values: FormValues): Promise<void> => {
      values.event?.preventDefault();

      const user = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.email,
        confirmPassword: values.confirmPassword
      };

      await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(user)
      });
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const response = await fetch("/api/users/is-user-auth", {
        headers: {
          "x-access-token": String(localStorage.getItem("token"))
        }
      });
      const data = await response.json();
      if (data.isLoggedIn) {
        navigate("/dashboard");
      }
    };

    verifyAuth();
  }, [navigate]);

  return (
    <div className="register-form-container">
      <form onSubmit={formik.handleSubmit} method="post">
        <fieldset>
          <legend>User registration form</legend>
          <label htmlFor="firstName">First name:</label>
          <input
            type="text"
            className="first-name"
            required
            {...formik.getFieldProps("firstName")}
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <small className="text-danger">{formik.errors.firstName}</small>
          ) : null}
          <label htmlFor="lastName">Last name:</label>
          <input
            type="text"
            className="last-name"
            required
            {...formik.getFieldProps("lastName")}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <small className="text-danger">{formik.errors.lastName}</small>
          ) : null}
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="email"
            required
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <small className="text-danger">{formik.errors.email}</small>
          ) : null}
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            className="password"
            required
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <small className="text-danger">{formik.errors.password}</small>
          ) : null}
          <label htmlFor="confirmPassword">Confirm password:</label>
          <input
            type="password"
            className="password"
            required
            {...formik.getFieldProps("confirmPassword")}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <small className="text-danger">{formik.errors.confirmPassword}</small>
          ) : null}
        </fieldset>
        <input type="submit" value="Register" className="btn btn-primary btn-lg" />
      </form>
    </div>
  );
};

export default Register;