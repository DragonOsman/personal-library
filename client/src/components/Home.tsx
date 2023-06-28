import { useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import BookList from "./BookList";
import Loader from "../components/Loader";
import "./Home.css";

const Home = () => {
  const { userContext, setUserContext } = useContext(UserContext);
  const navigate = useNavigate();

  const previousUserContext = userContext;

  const fetchUserDetails = useCallback(async () => {
    const response = await fetch(
      "https://personal-library-app.vercel.app/api/users/user-info", {
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
  }, [navigate, previousUserContext, setUserContext, userContext.token]);

  useEffect(() => {
    // fetch only when user details are not present
    // or when first and last name properties are
    // empty strings
    if (!userContext.details ||
        (userContext.details.firstName === "" && userContext.details.lastName === "")) {
      fetchUserDetails();
    }
  }, [userContext.details, fetchUserDetails]);

  if (!userContext.details) {
    return (
      <Loader />
    );
  } else if (userContext.details === null ||
             userContext.details.firstName === "" ||
             userContext.details.lastName === "") {
      return (
        <p className="text-danger">Error Loading User details</p>
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
        {userContext.details.books.length > 0 ? (
          <>
            <h3>Below you can see your list of books:</h3>
            <BookList />
          </>
        ) : (
          <h3>Please add some books first!</h3>
        )}
      </div>
    );
  }
};

export default Home;