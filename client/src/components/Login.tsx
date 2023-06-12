import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

interface FormValues {
  email: string;
  password: string;
}

const Login = () => {
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
        .max(6, "Must be at least 6 characters")
        .required("This is a required field")
    }),
    onSubmit: async (values: FormValues): Promise<void> => {
      const user = {
        email: values.email,
        password: values.password
      };

      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(user)
      });

      const data = await response.json();
      localStorage.setItem("token", data.token);
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const response = await fetch(`/api/users/is-user-auth`, {
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
    <div className="login-form-container">
      <form onSubmit={formik.handleSubmit}>
        <fieldset>
          <legend>User login form</legend>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="email"
            required
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.values.email ? (
            <small className="text-danger">{formik.errors.email}</small>
          ) : null}
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            className="password"
            required
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.values.password ? (
            <small className="text-danger">{formik.errors.password}</small>
          ) : null}
        </fieldset>
        <input type="submit" value="Login" />
        <p className="register-cta">Don't have an account yet? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
};

export default Login;