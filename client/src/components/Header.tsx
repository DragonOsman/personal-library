import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";
import logo from "../logo.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <nav className="navbar navbar-brand">
        <img
          src={logo}
          alt="dragon logo"
          className="logo"
        />
        <ul className="navbar-list">
          <Link to="/login" className="navbar-list-item">
            <li className="navbar-list-item">Register/Login</li>
          </Link>
        </ul>
      </nav>
    </header>
  );
};

export default Header;