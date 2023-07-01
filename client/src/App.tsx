import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Loader from "./components/Loader";
import { Route, Routes } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { useContext, useEffect, useCallback } from "react";
import "./App.css";

function App() {
  const { userContext, setUserContext } = useContext(UserContext);

  const previousUserContext = userContext;

  const verifyUser = useCallback(async () => {
    try {
      const response = await fetch(
        "https://personal-library-backend.vercel.app/api/users/refreshToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "credentials": "include"
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
  }, [previousUserContext, setUserContext]);

  useEffect(() => {
    // run the function every 14 minutes,
    // since access tokens expire in 15
    setTimeout(verifyUser, 14 * 60 * 1000);
  }, [verifyUser]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={userContext.token === null ? <Login /> : (
          userContext.token ? <Home /> : <Loader />)} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;