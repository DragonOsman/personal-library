import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Loader from "./components/Loader";
import { Route, Routes } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { useContext } from "react";
import "./App.css";

function App() {
  const { userContext, setUserContext } = useContext(UserContext);

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