import { useContext, useEffect, useCallback, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { BookContext } from "../context/BookContext";
import BookList from "./BookList";
import Loader from "../components/Loader";
import "./Home.css";

const Home = () => {
  const { userContext, setUserContext } = useContext(UserContext);
  const { bookContext, setBookContext } = useContext(BookContext);
  const navigate = useNavigate();

  const previousUserContext = userContext;

  const [error, setError] = useState("");

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
          navigate("/users/login");
        }
        setUserContext({ ...previousUserContext, details: null });
      }
    } catch (err) {
      console.log(`Error fetching user details: ${err}`);
      setError(err as string);
    }
  }, [navigate, setUserContext, previousUserContext, userContext.token]);

  useEffect(() => {
    // fetch only when user details are not present
    if (!userContext.details) {
      fetchUserDetails();
    }
  }, [fetchUserDetails, userContext.details]);

  const refetchDetails = () => setUserContext({ ...previousUserContext, details: undefined });

  const renderBooks = (
    bookContext.length > 0 ? (
      <>
        <h1 className="book-list-indicator">
          Below you can see your list of books (click or tap the button):
        </h1>
        <BookList />
      </>
    ) : (
      <>
        <p>No books to show!</p>
        <p>Please <Link to="/books/add-book">add some books</Link> first!</p>
      </>
    )
  );

  return (
    <div
      className="user-details container-fluid row
      d-xs-flex d-sm-flex d-md-flex d-lg-flex d-xl-flex d-xxl-flex
      flex-column justify-content-center align-items-center"
    >
      <div className="col-xs-12 col-sm-12 col-md-2 col-lg-12
      col-xl-12 col-xxl-12 container-fluid">
        {userContext.details === null ? (
          <>
            <p className="text-danger">
              Error loading user details
              <br />
              {error !== "" && <span>{error}</span>}
            </p>
            {renderBooks}
          </>
        ) : (
          !userContext.details ? (
            <>
              <p>Loading user details</p>
              <Loader />
              {renderBooks}
            </>
          ) : (
            <>
              <h1>Welcome,&nbsp;
                <strong>
                  {userContext.details.firstName}
                  {` ${userContext.details.lastName}`}
                </strong>!
              </h1>
              <button
                type="button"
                title="refetch user details"
                className="btn btn-primary fetch-details"
                onClick={refetchDetails}
              >
                Refetch User Details
              </button>
              {renderBooks}
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Home;