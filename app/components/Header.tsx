import logo from "../../public/images/logo.png";
import Image from "next/image";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from "@clerk/nextjs";

const Header = () => {
  return (
    <header>
      <Image
        src={logo.src}
        alt="Logo"
        height={logo.height}
        width={logo.width}
        className="dragon-logo"
      />
      <nav>
        <ul>
          <SignedOut>
            <SignInButton />
            <li className="nav-item">
              <a
                href="/api/auth/signup"
                className="link"
                title="sign-up link"
              >
                Sign Up
              </a>
            </li>
            <li className="nav-item">
              <a
                href="/api/auth/signin"
                className="link"
                title="sign-in link"
              >
                Sign In
              </a>
            </li>
          </SignedOut>
          <SignedIn>
            <UserButton />
            <li className="nav-item">
              <a
                href="/api/auth/signout"
                title="sign-out link"
                className="link"
              >
                Sign Out
              </a>
            </li>
            <li className="nav-item">
              <a
                href="/api/auth/dashboard"
                title="dashboard link"
                className="link"
              >
                Dashboard
              </a>
            </li>
          </SignedIn>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
