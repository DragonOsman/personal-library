import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import BookList from "./BookList";
import Loader from "../components/Loader";

const Home = () => {
  const { userContext, setUserContext } = useContext(UserContext);
  const navigate = useNavigate();

  const previousUserContext = userContext;

  useEffect(() => {
    const fetchUserDetails = async () => {
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
        console.log("In Home component, user details fetching 'ok' condition block:");
        for (const key of Object.keys(data)) {
          for (const value of Object.values(data)) {
            console.log(`${key}:${value}`);
          }
        }
      } else {
        if (response.status === 401) {
          // Edge case: when the token has expired.
          // This could happen if the refreshToken calls have failed due to network error or
          // User has had the tab open from previous day and tries to fetch data
          navigate("/login");
        }
        console.log("Inside else block for user details fetching request");
        setUserContext({ ...previousUserContext, details: null });
      }
    };

    // fetch only when user details are not present
    if (!userContext.details) {
      fetchUserDetails();
    }
  }, [navigate, previousUserContext, setUserContext, userContext.details, userContext.token]);

  if (userContext.details === null) {
    return (
      <p className="text-danger">Error Loading User details</p>
    );
  }

  if (!userContext.details) {
    return <Loader />;
  } else {
    return (
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
    );
  }
};

export default Home;