import "./Header.css";
import logo from "../logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const loginEffect = async () => {
      const response = await fetch("/api/users/is-user-auth", {
        headers: {
          "x-access-token": String(localStorage.getItem("token"))
        }
      });
      const data = await response.json();
      if (data.isLoggedIn) {
        setFirstName(data.firstname);
        setLastName(data.lastname);
        setEmail(data.email);
      }
    };

    loginEffect();
  }, []);

  return (
    <header>
      <nav
        className="navbar navbar-brand navbar-expand-sm
                  navbar-expand-md navbar-expand-lg
                  navbar-expand-xl navbar-expand-xxl"
        role="navigation"
      >
        <img
          src={logo}
          alt="dragon logo"
          className="logo navbar-brand"
        />
        <button className="navbar-toggler" type="button">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            {firstName && lastName && email ? (
              <>
                <li className="nav-item">
                  <Link
                    to={`/users/${firstName.toLowerCase()}-${lastName.toLowerCase()}`}
                    className="nav-link"
                  >
                    Profile
                  </Link>
                </li>
                <li onClick={logout} className="nav-item">Logout</li>
              </>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login/Register
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;