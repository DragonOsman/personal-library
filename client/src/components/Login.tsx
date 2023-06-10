import { useNavigate } from "react-router-dom";
import { useEffect, useState, FormEvent } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const user = {
      email,
      password
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
  };

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
    <form onSubmit={event => handleLogin(event)}>
      <input
        required
        type="email"
        name="email"
        className="email"
        value={email}
        onChange={event => setEmail(event.target.value)}
      />
      <input
        required
        type="password"
        name="password"
        className="password"
        value={password}
        onChange={event => setPassword(event.target.value)}
      />
      <input type="submit" value="Login" />
    </form>
  );
};

export default Login;