"use client";

import logo from "../../../public/images/logo.png";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { useSession } from "next-auth/react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="Logo" width={120} height={60} />
        </Link>
        <div className="md:hidden">
          <span
            role="button"
            tabIndex={0}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={handleToggle}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleToggle();
            }}
            className="text-2xl cursor-pointer"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </span>
        </div>
        <div className="navbar-container">
          <nav className="navbar">
            <ul>
              {isAuthenticated ? (
                <>
                  <li className="nav-item nav-link">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="nav-item nav-link">
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li className="nav-item nav-link">
                    <Link href="/api/auth/signout">Sign Out</Link>
                  </li>
                  <li className="nav-item nav-link">
                    <Link href="/books/add-book">Add a Book</Link>
                  </li>
                  <li className="nav-item nav-link">
                    <Link href="/books/list-books">List Books</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item nav-link">
                    <Link href="/signin">Sign In</Link>
                  </li>
                  <li className="nav-item nav-link">
                    <Link href="/signup">Sign Up</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
