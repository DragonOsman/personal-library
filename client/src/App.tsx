import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Loader from "./components/Loader";
import { Route, Routes } from "react-router-dom";
import { useEffect, useContext, useCallback } from "react";
import { UserContext } from "./context/UserContext";
import "./App.css";

function App() {
  const { userContext, setUserContext } = useContext(UserContext);

  const previousUserContext = userContext;

  const verifyUser = useCallback(async () => {
    const response = await fetch(
      "https://personal-library-server.onrender.com/api/users/refreshToken", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      const data = await response.json();
      setUserContext({ ...previousUserContext, token: data.token });
    } else {
      setUserContext({ ...previousUserContext, token: null });
    }

    setTimeout(verifyUser, 5 * 60 * 1000);
  }, [previousUserContext, setUserContext]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={!userContext.token ? <Login /> : (
          userContext.token ? <Home /> : <Loader />)} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;