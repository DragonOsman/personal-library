import { useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import BookList from "./BookList";
import Loader from "../components/Loader";

const Home = () => {
  const { userContext, setUserContext } = useContext(UserContext);
  const navigate = useNavigate();

  const previousUserContext = userContext;
  if (userContext.token) {
    console.log(`userContext.token: ${userContext.token}`);
  }

  const fetchUserDetails = useCallback(async () => {
    const response = await fetch(
      "https://personal-library-rvi3.onrender.com/api/users/user-info", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `jwt ${userContext.token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setUserContext({ ...previousUserContext, details: data });
      console.log(`In Home component, user details fetching 'response.ok' condition:
        ${data.forEach((dataItem: string) => console.log(dataItem))}`
      );
    } else {
      if (response.status === 401) {
        // Edge case: when the token has expired.
        // This could happen if the refreshToken calls have failed due to network error or
        // User has had the tab open from previous day and tries to fetch data
        navigate("/login");
      }
    }
  }, [previousUserContext, setUserContext, userContext.token, navigate]);

  useEffect(() => {
    // fetch only when user details are not present
    if (!userContext.details) {
      fetchUserDetails();
    }
  }, [fetchUserDetails, userContext.details]);

  return (
    userContext.details === null ? (
      <p className="text-danger">Error Loading User details</p>
    ) : !userContext.details ? (
      <Loader />
    ) : (
      <div className="user-details">
        <p>
          Welcome&nbsp;
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
    )
  );
};

export default Home;