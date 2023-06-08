import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";
import logo from "../logo.png";

const Header = () => {
  return (
    <header>
      <nav className="navbar navbar-dark navbar-brand">
        <img
          src={logo}
          alt="dragon logo"
          className="logo"
        />
        <ul className="navbar-list">
          <li className="navbar-list-item">Register/Login</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;