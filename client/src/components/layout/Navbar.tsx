import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="navbar-fixed">
      <nav className="z-depth-0">
        <div className="nav-wrapper white">
          <Link
            to="/"
            className="col s5 brand-logo center black-text"
          >
            <i className="material-icons">Home</i>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;