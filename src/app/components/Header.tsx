"use client";

import logo from "../../../public/images/logo.png";
import Image from "next/image";
import { useState } from "react";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from "@clerk/nextjs";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header>
      <div className="header-container">
        <Image
          src={logo.src}
          alt="Logo"
          height={logo.height}
          width={logo.width}
          className="dragon-logo"
        />
        <i className="fas fa-bars" onClick={toggleMenu} />
        <nav className={`nav-menu ${isOpen ? "open" : ""}`}>
          <ul>
            <SignedOut>
              <li className="nav-item">
                <SignInButton>
                  <button type="button" className="sign-in-button" title="Sign In">
                    Sign In
                  </button>
                </SignInButton>
              </li>
              <li className="nav-item">
                <SignUpButton>
                  <button type="button" className="sign-up-button" title="Sign Up">
                    Sign Up
                  </button>
                </SignUpButton>
              </li>
            </SignedOut>
            <SignedIn>
              <UserButton />
              <li className="nav-item">
                <SignOutButton>
                  <button type="button" className="sign-out-button" title="Sign Out">
                    Sign Out
                  </button>
                </SignOutButton>
              </li>
              <li className="nav-item">
                <UserButton />
              </li>
            </SignedIn>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
