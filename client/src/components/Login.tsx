import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import "./Login.css";

const Login = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Please enter your email address"),
      password: Yup.string().required("Please enter your password")
    }),
    onSubmit: async values => {
      console.log(values);
    }
  });

  return (
    <div className="login-form-container">
      <div className="col-10 col-sm-8 col-md-5 mx-auto">
        <h1>Login</h1>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <fieldset className="mb-3 col-10 col-sm-8 col-md-5 mx-auto mt-5">
          <legend>Email</legend>
          <input
            type="email"
            id="email"
            required
            {...formik.getFieldProps("email")}
          />
        </fieldset>
        <fieldset className="mb-3 col-10 col-sm-8 col-md-5 mx-auto mt-5">
          <legend>Password</legend>
          <input
            type="password"
            id="password"
            required
            {...formik.getFieldProps("password")}
          />
        </fieldset>

        <div className="col-10 col-sm-8 col-md-5 mx-auto">
          <input
            type="submit"
            value="Login"
            className="btn btn-lg btn-primary btn-block"
          />
        </div>
        <div className="col-10 col-sm-8 col-md-5 mx-auto mt-5">
          <p>
            <Link to="/account/forgot" className="password-forgot">
              I forgot my password
            </Link>
          </p>
          <p className="register-cta">
            Don't have an account?{" "}
            <Link className="register" to="/register">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;