import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Loader from "./components/Loader";
import { Route, Routes } from "react-router-dom";
import { useEffect, useContext } from "react";
import { TokenContext, AccessToken } from "./context/TokenContext";
import "./App.css";

function App() {
  const { tokenData, setTokenData } = useContext(TokenContext);

  // To check if user is logged in
  useEffect(() => {
    const checkJwtToken = async () => {
      const response:Response = await fetch("/users/accessToken", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.accessToken) {
          setTokenData(data.token);
        }
      } else {
        setTokenData(null as unknown as AccessToken);
      }
    };

    checkJwtToken();
  }, [setTokenData]);

  useEffect(() => {
    const verifyUser = async () => {
      await fetch("/users/refreshToken", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      });

      setTimeout(verifyUser, 5 * 60 * 1000);
    };

    verifyUser();
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={!tokenData ? <Login /> : (
          tokenData ? <Home /> : <Loader />)} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;