import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Loader from "./components/Loader";
import AddBook from "./components/AddBook";
import ShowBookDetails from "./components/ShowBookDetails";
import UpdateBook from "./components/UpdateBook";
import { Route, Routes } from "react-router-dom";
import { useEffect, useContext, useCallback } from "react";
import { UserContext } from "./context/UserContext";
import "./App.css";

function App() {
  const { userContext, setUserContext } = useContext(UserContext);

  const verifyUser = useCallback(async () => {
    const previousUserContext = userContext;
    try {
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
    } catch (err) {
      console.log(`Error while making request to refreshToken route: ${err}`);
    }
  }, [setUserContext, userContext]);

  useEffect(() => {
    // call verifyUser every 5mins
    setTimeout(verifyUser, 5 * 60 * 1000);
    verifyUser();
  }, [verifyUser]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={!userContext.token ? <Login /> : (
          userContext.token ? <Home /> : <Loader />)} />
        <Route path="/users/register" element={<Register />} />
        <Route path="/users/login" element={<Login />} />
        <Route path="/books/add-book" element={<AddBook />} />
        <Route path="/books/show-book/:id" element={<ShowBookDetails />} />
        <Route path="/books/update-book/:id" element={<UpdateBook />} />
      </Routes>
    </>
  );
}

export default App;