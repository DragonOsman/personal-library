import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader";
import UserInfo from "../components/UserInfo";

// TODO: Fetch user data from backend and
// greet the user with their name, then
// show a link to their profile page which
// would have their info and list of titles of books
const Home = () => {
  const { userContext, setUserContext } = useContext(UserContext);

  return (
    userContext.details === null ? (
      <p className="text-danger">Error Loading User details</p>
    ) : !userContext.details ? (
      <Loader />
    ) : (
      <UserInfo />
    )
  );
};

export default Home;