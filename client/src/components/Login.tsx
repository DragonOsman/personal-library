import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { UserContext } from "../context/UserContext";
import { useContext, useState } from "react";
import * as Yup from "yup";
import "./Login.css";

interface FormValues {
  email: string;
  password: string;
}

const Login = () => {
  const { userContext, setUserContext } = useContext(UserContext);

  const previousUserContext = userContext;

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("This is a required field"),
      password: Yup.string()
        .min(6, "Must be at least 6 characters")
        .required("This is a required field")
    }),
    onSubmit: async (values:FormValues) => {
      formik.setSubmitting(true);

      const user = {
        username: values.email,
        email: values.email,
        password: values.password
      };

      try {
        const response = await fetch(
        "https://personal-library-server.vercel.app/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
          credentials: "include"
        });

        formik.setSubmitting(false);
        if (response.ok) {
          const data = await response.json();
          setUserContext({ ...previousUserContext, token: data.token });
          navigate("/");
        }
      } catch (err) {
        console.log(`Error when trying to log user in: ${err}`);
        setError(err as string);
      }
    }
  });

  return (
    <div className="login-form-container container-fluid">
      <form
        onSubmit={(event) => {event.preventDefault(); formik.handleSubmit(event);}}
        method="post"
      >
        <fieldset className="mb-3">
          <legend>User login form</legend>
          <label className="form-label" htmlFor="email">Email:</label>
          <input
            type="email"
            className="email form-control form-control-lg"
            placeholder="Please enter your email"
            required
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.values.email ? (
            <small className="text-danger">{formik.errors.email}</small>
          ) : null}
          <label className="form-label" htmlFor="password">Password:</label>
          <input
            type="password"
            className="password form-control form-control-lg"
            placeholder="Please enter your password"
            required
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.values.password ? (
            <small className="text-danger">{formik.errors.password}</small>
          ) : null}
        </fieldset>
        <input type="submit" value="Login" className="btn btn-primary btn-lg" />
        <p className="register-cta">Don't have an account yet?
          <Link to="/users/register"> Register</Link></p>
      </form>
      {error !== "" && <p className="text-danger">{error}</p>}
    </div>
  );
};

export default Login;