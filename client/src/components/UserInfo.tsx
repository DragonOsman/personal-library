import { useCallback, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import BookList from "./BookList";

const UserInfo = () => {
  const { userContext, setUserContext } = useContext(UserContext);
  const navigate = useNavigate();

  const previousUserContext = userContext;

  const fetchUserDetails = useCallback(async () => {
    const response = await fetch("/api/users/user-info", {
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
    } else {
      if (response.status === 401) {
        // Edge case: when the token has expired.
        // This could happen if the refreshToken calls have failed due to network error or
        // User has had the tab open from previous day and tries to fetch data
        navigate("/");
      }
    }
  }, [previousUserContext, setUserContext, userContext.token, navigate]);

  useEffect(() => {
    // fetch only when user details are not present
    if (!userContext.details) {
      fetchUserDetails();
    }
  }, [fetchUserDetails, userContext.details]);

  if (userContext.details) {
    return (
      <div className="user-details">
        <p>
          Welcome&nbsp;
          <strong>
            {userContext.details.firstName &&
            userContext.details.firstName}
            {userContext.details.lastName &&
            + " " + userContext.details.lastName}
          </strong>
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
  return <p>No details to show</p>;
};

export default UserInfo;