import { useContext, useEffect, useCallback, useState, JSX } from "react";
import { IBook } from "../IBook";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import BookList from "./BookList";
import Loader from "../components/Loader";
import "./Home.css";

const Home = (): JSX.Element => {
  const { userContext, setUserContext } = useContext(UserContext);
  const [books, setBooks] = useState<IBook[]>([{
    _id: "",
    title: "",
    author: "",
    isbn: "",
    description: "",
    publisher: "",
    published_date: ""
  }]);
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
    const fetchBooks = async () => {
      try {
        const booksResponse = await fetch(
          `https://personal-library-server.onrender.com/api/books/list-books`, {
            method: "GET",
            credentials: "include",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userContext.token}`
            }
          }
        );

        if (booksResponse.ok) {
          const booksData = await booksResponse.json();
          setBooks(booksData);
        }
      } catch (err) {
        console.log(`In Home.tsx, fetchBooks useEffect: ${err}`);
      }
    };

    fetchBooks();
  }, [userContext.token]);

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
  } else if (userContext.details === null ||
    userContext.details.firstName === "" || userContext.details.lastName === "") {
    return (
      <div className="user-details d-flex justify-content-center align-items-center flex-column">
        <p className="text-danger">
          Error loading user details or first and last names are unavailable temporarily
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
        {books.length > 0 ? (
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