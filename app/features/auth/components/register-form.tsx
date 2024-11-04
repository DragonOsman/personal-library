import { register } from "../actions/register";

const RegisterForm = () => {
  return (
    <form action={register} className="p-4 flex flex-col gap-y-2">
      <input type="text" name="firstName" placeholder="First Name" />
      <input type="text" name="lastName" placeholder="Last Name" />
      <input type="email" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <input type="password" name="confirmPassword" placeholder="Confirm Password" />
      <button type="submit">Register</button>
    </form>
  );
};

export { RegisterForm };