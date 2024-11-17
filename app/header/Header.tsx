import "./header.css";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex justify-items-center items-center">
      <Navbar />
    </header>
  );
};

export default Header;