import { useContext, useEffect, useCallback, JSX } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { BookContext } from "../context/BookContext";
import BookList from "./BookList";
import Loader from "../components/Loader";
import "./Home.css";

const Home = (): JSX.Element => {
  const { userContext, setUserContext } = useContext(UserContext);
  const { bookContext, setBookContext } = useContext(BookContext);
  const navigate = useNavigate();

  const previousUserContext = userContext;

  const fetchUserDetails = useCallback(async () => {
    try {
      const response:Response = await fetch("/api/users/user-info", {
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
          navigate("/users/login");
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

  return (
    <div className="user-details d-flex justify-content-center align-items-center flex-column">
      {userContext.details ? (
        <>
          <p>Welcome,&nbsp;
            <strong>
              {userContext.details.firstName}
              {` ${userContext.details.lastName}`}
            </strong>!
          </p>
          {bookContext && bookContext.length > 0 ? (
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
        </>
      ) : userContext.details === null ? (
        <p className="text-danger">
          Error loading user details
        </p>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Home;