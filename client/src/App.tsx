import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import Loader from "./components/Loader";
import { useContext, useCallback, useEffect } from "react";
import "./App.css";

function App() {
  const { userContext, setUserContext } = useContext(UserContext);

  const previousUserContext = userContext;

  const verifyUser = useCallback(async () => {
    try {
      const response = await fetch("/api/users/refreshToken", {
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
    // call function to get refresh token jwt only if
    // user is logged in (or at least that's the intention)
    if (userContext.token) {
      verifyUser();
    }
  }, [verifyUser, userContext.token]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={userContext.token === null ? (
          <Login />
         ) : userContext.token ? (
          <Home />
         ) : <Loader />}
      />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;