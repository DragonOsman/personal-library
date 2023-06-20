import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import UserInfo from "./components/UserInfo";
import { Route, Routes } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { useContext, useCallback, useEffect } from "react";
import "./App.css";

function App() {
  const { userContext, setUserContext } = useContext(UserContext);
  const CLIENT_URL = "https://personal-library-client.onrender.com";
  const SERVER_URL = "https://personal-library-rvi3.onrender.com";

  const previousUserContext = userContext;

  const verifyUser = useCallback(async () => {
    try {
      const response = await fetch(
        `${SERVER_URL}/api/users/refreshToken`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserContext({ ...previousUserContext, token: data.token });
      } else {
        setUserContext({ ...previousUserContext, token: null });
      }

      // call refreshToken every 5 minutes to renew the authentication token.
      setTimeout(verifyUser, 5 * 60 * 1000);
    } catch (error) {
      console.log(`in verifyUser, App component: ${error}`);
    }
  }, [setUserContext, previousUserContext]);

  useEffect(() => {
    if (userContext.token) {
      verifyUser();
    }
  }, [verifyUser, userContext.token]);

  if (userContext.token) {
    return (
      <>
        <Header />
        <Routes>
          <Route path={`${CLIENT_URL}/`} element={<Home />} />
          <Route path={`${CLIENT_URL}/login`} element={<Login />} />
          <Route path={`${CLIENT_URL}/register`} element={<Register />} />
          <Route path={`${CLIENT_URL}/dashboard`} element={<UserInfo />} />
        </Routes>
      </>
    );
  } else {
    return (
      <>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </>
    );
  }
}

export default App;