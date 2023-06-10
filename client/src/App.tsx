import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import UserInfo from "./components/UserInfo";
import { Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<UserInfo />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;