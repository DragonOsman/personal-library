import "./Register.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, FormEvent } from "react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const user = {
      firstName,
      lastName,
      email,
      password
    };

    await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(user)
    });
  };

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
    <form onSubmit={event => handleRegister(event)}>
      <input
        type="text"
        name="firstname"
        className="first-name"
        value={firstName}
        required
        onChange={event => setFirstName(event.target.value)}
      />
      <input
        type="text"
        name="lastname"
        className="last-name"
        value={lastName}
        required
        onChange={event => setLastName(event.target.value)}
      />
      <input
        type="email"
        name="email"
        className="email"
        value={email}
        required
        onChange={event => setEmail(event.target.value)}
      />
      <input
        type="password"
        name="password"
        className="password"
        value={password}
        required
        onChange={event => setPassword(event.target.value)}
      />
      <input
        type="password"
        name="confirm-password"
        className="password"
        value={confirmPassword}
        required
        onChange={event => setConfirmPassword(event.target.value)}
      />
      <input type="submit" value="Register" />
    </form>
  );
};

export default Register;