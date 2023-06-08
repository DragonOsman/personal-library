import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  return (
    <div className="login-form-container">
      <div className="col-10 col-sm-8 col-md-5 mx-auto">
        <h1>Login</h1>
      </div>
      <form>
        <fieldset className="mb-3 col-10 col-sm-8 col-md-5 mx-auto mt-5">
          <legend>Email</legend>
          <input
            type="email"
            name="email"
            id="email"
            className="form-control form-control-lg"
          />
        </fieldset>
        <fieldset className="mb-3 col-10 col-sm-8 col-md-5 mx-auto mt-5">
          <legend>Password</legend>
          <input
            type="password"
            name="passord"
            id="password"
            className="form-control form-control-lg"
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