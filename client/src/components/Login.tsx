import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import * as Yup from "yup";
import "./Login.css";

interface FormValues {
  email: string;
  password: string;
}

const Login = () => {
  const { userContext, setUserContext } = useContext(UserContext);

  const previousUserContext = userContext;

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
          "https://personal-library-server.onrender.com/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
          credentials: "include",
          mode: "cors"
        });

        formik.setSubmitting(false);
        if (response.ok) {
          const data = await response.json();
          setUserContext({ ...previousUserContext, token: data.token });
        }
      } catch (error) {
        console.log(`Error when trying to log user in: ${error}`);
      }
    }
  });

  return (
    <div className="login-form-container">
      <form onSubmit={(event) => {event.preventDefault(); formik.handleSubmit(event);}} method="post">
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
        <p className="register-cta">Don't have an account yet? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
};

export default Login;