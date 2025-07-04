"use client";

import logo from "../../../public/images/logo.png";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from "@clerk/nextjs";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <header>
      <nav className="flex justify-between items-center w-full h-20 px-4">
        <Link href="/">
          <Image
            src={logo.src}
            alt="Logo"
            height={logo.height}
            width={logo.width}
          />
        </Link>
        <ul className="hidden md:flex">
          <SignedOut>
            <li>
              <SignInButton>
                <button type="button" className="sign-in-button hover:brightness-100" title="Sign In">
                  Sign In
                </button>
              </SignInButton>
            </li>
            <li >
              <SignUpButton>
                <button type="button" className="sign-up-button hover:brightness-100" title="Sign Up">
                  Sign Up
                </button>
              </SignUpButton>
            </li>
          </SignedOut>
          <SignedIn>
            <li>
              <UserButton
                userProfileMode="navigation"
                userProfileUrl="/user-profile"
              />
            </li>
            <li className="nav-link">
              <Link href="/books/list-books">
                List Books
              </Link>
            </li>
            <li className="nav-link">
              <Link href="/books/add-book">
                Add Book
              </Link>
            </li>
          </SignedIn>
        </ul>
        <button
          type="button"
          title="Toggle Navbar"
          onClick={handleToggle}
          className="pr-4 z-10 text-gray-500 md:hidden"
        >
          {isOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
        </button>
        {isOpen && (
          <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full">
            <SignedOut>
              <li>
                <SignInButton>
                  <button type="button" className="sign-in-button" title="Sign In">
                    Sign In
                  </button>
                </SignInButton>
              </li>
              <li>
                <SignUpButton>
                  <button type="button" className="sign-up-button" title="Sign Up">
                    Sign Up
                  </button>
                </SignUpButton>
              </li>
            </SignedOut>
            <SignedIn>
              <li>
                <UserButton
                  userProfileMode="navigation"
                  userProfileUrl="/user-profile"
                />
              </li>
              <li className="nav-link">
                <Link href="/books/list-books">
                  List Books
                </Link>
              </li>
              <li className="nav-link">
                <Link href="/books/add-book">
                  Add Book
                </Link>
              </li>
            </SignedIn>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Header;
