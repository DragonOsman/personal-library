import "./Register.css";
import { useFormik } from "formik";
import * as Yup from "yup";

const Register = () => {
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
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Please enter your first name"),
      lastName: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Please enter your last name"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Please enter your email address"),
      password: Yup.string()
        .min(6, "Must be at least 6 characters")
        .required("Please enter a password"),
      confirmPassword: Yup.string()
        .test("passwords-match", "Passwords must match", function(value: string | undefined): boolean {
          return this.parent.password === value;
        })
        .required("Please retype the password")
    })
  });

  return (
    <div className="register-form-container">
      <div className="col-10 col-sm-5 col-md-8 mx-auto">
        <h1>Register</h1>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <fieldset className="mb-3 col-10 col-sm-8 col-md-5 mx-auto mt-5">
          <legend>First Name</legend>
          <input
            type="text"
            name="firstName"
            id="firstName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
            required
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <small className="form-text text-danger">
              {formik.errors.firstName}
            </small>
          ) : null}
        </fieldset>
        <fieldset className="mb-3 col-10 col-sm-8 col-md-5 mx-auto mt-5">
        <legend>Last Name</legend>
          <input
            type="text"
            name="lastName"
            id="lastName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
            required
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <small className="form-text text-danger">
              {formik.errors.lastName}
            </small>
          ) : null}
        </fieldset>
        <fieldset className="mb-3 col-10 col-sm-8 col-md-5 mx-auto mt-5">
        <legend>Email</legend>
          <input
            type="email"
            name="email"
            id="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            required
          />
          {formik.touched.email && formik.errors.email ? (
            <small className="form-text text-danger">
              {formik.errors.email}
            </small>
          ) : null}
        </fieldset>
        <fieldset className="mb-3 col-10 col-sm-8 col-md-5 mx-auto mt-5">
        <legend>Password</legend>
          <input
            type="password"
            name="password"
            id="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            required
          />
          {formik.touched.password && formik.errors.password ? (
            <small className="form-text text-danger">
              {formik.errors.password}
            </small>
          ) : null}
        </fieldset>
        <fieldset className="mb-3 col-10 col-sm-8 col-md-5 mx-auto mt-5">
        <legend>Confirm Password</legend>
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            required
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <small className="form-text text-danger">
              {formik.errors.confirmPassword}
            </small>
          ) : null}
        </fieldset>
        <div className="col-10 col-sm-8 col-md-5 mx-auto mt-5">
          <input
            type="submit"
            value="Register"
            className="btn btn-lg btn-primary btn-block register-button"
          />
        </div>
      </form>
    </div>
  );
};

export default Register;