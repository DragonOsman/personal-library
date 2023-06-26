import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Loader from "./components/Loader";
import { Route, Routes } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { useContext, useCallback, useEffect } from "react";
import "./App.css";

function App() {
  const { userContext, setUserContext } = useContext(UserContext);

  const previousUserContext = userContext;

  const verifyUser = useCallback(async () => {
    try {
      const response = await fetch(
        "https://personal-library-rvi3.onrender.com/api/users/refreshToken", {
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
    } catch (error) {
      console.log(`in verifyUser, App component: ${error}`);
    }
  }, [setUserContext, previousUserContext]);

  useEffect(() => {
    // call refreshToken every 5 minutes to renew the authentication token.
    setTimeout(verifyUser, 5 * 60 * 1000);
  }, [verifyUser]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={userContext.token === null ? <Login /> : (
          userContext.token ? <Home /> : <Loader />)} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;