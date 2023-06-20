import "./Header.css";
import logo from "../logo.png";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

const Header = () => {
  const { userContext, setUserContext } = useContext(UserContext);
  const URL = "https://personal-library-client.onrender.com";

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
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="d-flex collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
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
                    <Link to={`${URL}/login`} className="nav-link">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to={`${URL}/register`} className="nav-link">
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-link">
                    <button type="button" onClick={async e => {
                      try {
                        await fetch(
                          "https://personal-library-rvi3.onrender.com/api/users/logout", {
                          method: "POST",
                          credentials: "include",
                          headers: {
                            "Content-Type": "application/json"
                          }
                        });
                        const previousUserContext = userContext;
                        setUserContext({ ...previousUserContext, token: null });
                      } catch (err) {
                        console.log(`Header component, logout button code error: ${err}`);
                      }
                    }}></button>
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