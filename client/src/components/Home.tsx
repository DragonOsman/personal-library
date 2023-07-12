import { useContext, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { BookContext } from "../context/BookContext";
import BookList from "./BookList";
import Loader from "../components/Loader";
import "./Home.css";

const Home = () => {
  const { userContext, setUserContext } = useContext(UserContext);
  const { booksContext, setBooksContext } = useContext(BookContext);
  const navigate = useNavigate();

  const previousUserContext = userContext;

  const fetchUserDetails = useCallback(async () => {
    try {
      const response:Response = await fetch(
        "https://personal-library-server.onrender.com/api/users/user-info", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userContext.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserContext({ ...previousUserContext, details: data.user });
      } else {
        if (response.status === 401) {
          navigate("/login");
        }
        setUserContext({ ...previousUserContext, details: null });
      }
    } catch (err) {
      console.log(`Error fetching user details: ${err}`);
    }
  }, [navigate, setUserContext, previousUserContext, userContext.token]);

  useEffect(() => {
    // fetch only when user details are not present
    // or when first and last name properties are
    // empty strings
    if (!userContext.details ||
        (userContext.details.firstName === "" && userContext.details.lastName === "")) {
      fetchUserDetails();
    }
  }, [fetchUserDetails, userContext.details]);

  if (!userContext.details) {
    return (
      <Loader />
    );
  } else if (userContext.details === null) {
      return (
        <div className="user-details d-flex justify-content-center align-items-center flex-column">
          <p className="text-danger">
            Error Loading User details
          </p>
        </div>
      );
    } else {
    return (
      <div className="user-details d-flex justify-content-center align-items-center flex-column">
        <p>
          Welcome,&nbsp;
          <strong>
            {userContext.details.firstName}
            {` ${userContext.details.lastName}`}
          </strong>!
        </p>
        {booksContext.length > 0 ? (
          <>
            <h1>Below you can see your list of books:</h1>
            <BookList />
          </>
        ) : (
          <>
            <p>No books to show!</p>
            <p>Please <Link to="/books/add-book">add some books</Link> first!</p>
          </>
        )}
      </div>
    );
  }
};

export default Home;