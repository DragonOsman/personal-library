import "./Header.css";
import logo from "../logo.png";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";

const Header = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { userContext, setUserContext } = useContext(UserContext);

  const previousUserContext = userContext;

  const handleToggle = () => setIsCollapsed(!isCollapsed);

  const handleLogout = async () => {
    try {
      await fetch(
        "https://personal-library-server.vercel.app/api/users/logout", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userContext.token}`
          }
        }
      );

      setUserContext({ ...previousUserContext, details: undefined, token: null });

    } catch (err) {
      console.log(`Error in logoutHandler, catch block: ${err}`);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await fetch(`
        https://personal-library-server.vercel.app/api/users/delete-account`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userContext.token}`
          },
          credentials: "include",
          body: JSON.stringify({ ...userContext.details })
        });

        setUserContext({ ...previousUserContext, details: undefined, token: null });
    } catch (err) {
      console.log(`Error trying to delete user account: ${err}`);
    }
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a href="/" className="navbar-brand">
            <img
              src={logo}
              alt="dragon logo"
              className="dragon-logo"
            />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#responsive-navbar"
            aria-controls="responsive-navbar"
            aria-expanded="false"
            onClick={handleToggle}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="responsive-navbar">
            <ul className="navbar-nav mb-2 mb-lg-0">
              {!userContext.token ? (
                <>
                  <li className="nav-item">
                    <Link to="/users/login" className="nav-link">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/users/register" className="nav-link">Register</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/" className="nav-link">Home</Link>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      className="btn btn-danger logout-btn"
                      onClick={handleLogout}
                      title="logout"
                    >
                      Logout
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleDeleteAccount}
                      title="delete account"
                    >
                      Delete Account
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;