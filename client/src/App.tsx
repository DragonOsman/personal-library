import Header from "./components/Header";
import Login from "./components/Login";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { useContext } from "react";
import "./App.css";

function App() {
  const { user, setUser } = useContext(UserContext);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={user.token ? <Home /> : <Login />} />
      </Routes>
    </>
  );
}

export default App;