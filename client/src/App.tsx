import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Loader from "./components/Loader";
import { Route, Routes } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { useContext, useEffect } from "react";
import "./App.css";

function App() {
  const { userContext, setUserContext } = useContext(UserContext);

  const previousUserContext = userContext;

  useEffect(() => {
    const verifyUser = async () => {
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
    };

    verifyUser();
  }, [previousUserContext, setUserContext]);

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