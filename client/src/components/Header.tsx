import logo from "../../public/images/logo.png";

const Header = () => {
  return (
    <header>
      <nav>
        <img
          src={logo}
          alt="dragon logo"
          className="float-left"
        />
        <ul className="navbar-list">
          <li className="navbar-list-item">Register/Login</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;