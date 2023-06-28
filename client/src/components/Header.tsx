import "./Header.css";
import logo from "../logo.png";
import { Link } from "react-router-dom";
import { Navbar, NavLink, Nav } from "react-bootstrap";
import NavbarToggle from "react-bootstrap/NavbarToggle";
import NavbarCollapse from "react-bootstrap/NavbarCollapse";
import NavItem from "react-bootstrap/NavItem";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Header = () => {
  const { userContext, setUserContext } = useContext(UserContext);

  const previousUserContext = userContext;

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
      <Navbar collapseOnSelect expand="lg" data-bs-theme="dark" fixed="top">
        <Container>
          <img
            src={logo}
            alt="dragon logo"
            className="dragon-logo"
          />
          <NavbarToggle aria-controls="responsive-navbar-nav" />
          <NavbarCollapse id="responsive-navbar-nav">
            <Nav as="ul">
              {!userContext.token ? (
                <>
                  <NavItem as="li">
                    <NavLink as={Link} to="/login">Login</NavLink>
                  </NavItem>
                  <NavItem as="li">
                    <NavLink as={Link} to="/register">Register</NavLink>
                  </NavItem>
                </>
              ) : (
                <>
                  <NavItem as="li">
                    <NavLink as={Link} to="/">Home</NavLink>
                  </NavItem>
                  <NavItem as="li">
                    <Button
                      type="button"
                      variant="danger"
                      onClick={logoutHandler}
                    >
                      Logout
                    </Button>
                  </NavItem>
                </>
              )}
            </Nav>
          </NavbarCollapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;