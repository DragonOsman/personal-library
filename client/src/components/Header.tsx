import "./Header.css";
import logo from "../logo.png";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext, useState } from "react";

const Header = () => {
  const { userContext, setUserContext } = useContext(UserContext);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavCollapse = () => setIsCollapsed(!isCollapsed);

  const previousUserContext = userContext;

  const logoutHandler = async () => {
    try {
      await fetch(
        "https://personal-library-rvi3.onrender.com/api/users/logout", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `jwt ${userContext.token}`
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
      <nav
        className="navbar navbar-brand navbar-expand-sm
                  navbar-expand-md navbar-expand-lg
                  navbar-expand-xl navbar-expand-xxl"
      >
        <img
          src={logo}
          alt="dragon logo"
          className="logo navbar-brand"
        />
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded={!isCollapsed ? true : false}
          aria-label="Toggle navigation"
          onClick={handleNavCollapse}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`d-flex ${isCollapsed ? "collapse" : ""} navbar-collapse justify-content-end`}
          id="navbarSupportedContent">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            {!userContext.token ?
              (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link">
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-link">
                    <button
                      type="button"
                      onClick={logoutHandler}
                      className="btn btn-primary btn-light"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}

          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;