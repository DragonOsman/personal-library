const Register = () => {
  return (
    <div className="register-form-container">
      <div className="col-10 col-sm-5 col-md-8 mx-auto">
        <h1>Register</h1>
      </div>

      <form>
        <fieldset className="mb-3 col-10 col-sm-8 col-md-5 mx-auto mt-5">
          <legend>First Name</legend>
          <input
            type="text"
            name="firstName"
            id="firstName"
            className="form-control form-control-lg"
            required
          />
        </fieldset>
        <fieldset className="mb-3 col-10 col-sm-8 col-md-5 mx-auto mt-5">
        <legend>Last Name</legend>
          <input
            type="text"
            name="lastName"
            id="lastName"
            className="form-control form-control-lg"
            required
          />
        </fieldset>
        <fieldset className="mb-3 col-10 col-sm-8 col-md-5 mx-auto mt-5">
        <legend>Email</legend>
          <input
            type="email"
            name="email"
            id="email"
            className="form-control form-control-lg"
            required
          />
        </fieldset>
        <fieldset className="mb-3 col-10 col-sm-8 col-md-5 mx-auto mt-5">
        <legend>Password</legend>
          <input
            type="password"
            name="password"
            id="password"
            className="form-control form-control-lg"
            required
          />
        </fieldset>
        <fieldset className="mb-3 col-10 col-sm-8 col-md-5 mx-auto mt-5">
        <legend>Confirm Password</legend>
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            className="form-control form-control-lg"
            required
          />
        </fieldset>
        <div className="col-10 col-sm-8 col-md-5 mx-auto mt-5">
          <input
            type="submit"
            value="Register"
            className="btn-btn-lg btn-primary btn-block register-button"
          />
        </div>
      </form>
    </div>
  );
};

export default Register;