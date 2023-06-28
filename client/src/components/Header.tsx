import "./Header.css";
import logo from "../logo.png";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

const Header = () => {
  const { userContext, setUserContext } = useContext(UserContext);

  const previousUserContext = userContext;

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => setIsCollapsed(!isCollapsed);

  const logoutHandler = async () => {
    try {
      await fetch(
        "https://personal-library-app.vercel.app/api/users/logout", {
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

  return (
    <header>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <img
            src={logo}
            alt="dragon logo"
            className="dragon-logo navbar-brand"
          />
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggler="#responsive-navbar"
            aria-controls="responsive-navbar"
            aria-expanded={!isCollapsed ? true : false}
            onClick={handleToggle}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse d-flex align-items-end" id="responsive-navbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {!userContext.token ? (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link">Register</Link>
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
                      className="btn btn-danger"
                      onClick={logoutHandler}
                    >
                      Logout
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