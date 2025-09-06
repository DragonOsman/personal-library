"use client";

import logo from "../../../public/images/logo.png";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <header className="bg-black color-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="Logo" width={120} height={60} />
        </Link>
        <div className="md:hidden">
          <button
            type="button"
            tabIndex={0}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={handleToggle}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleToggle();
            }}
            className="text-2xl cursor-pointer"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div className={`${isOpen ? "block" : "hidden"}`}>
          <nav className="w-full md:block md:w-auto top-0 left-0 absolute">
            <ul className="flex flex-col md:flex-row md:items-center md:space-x-6 p-4 md:p-0">
              {isAuthenticated ? (
                <>
                  <li className="nav-item nav-link">
                    <Link
                      href="/"
                      className="block py-2 md:py-0"
                    >
                      Home
                    </Link>
                  </li>
                  <li className="nav-item nav-link">
                    <Link
                      href="/profile"
                      className="block py-2 md:py-0"
                    >
                      Profile
                    </Link>
                  </li>
                  <li className="nav-item nav-link">
                    <button
                      onClick={() => signOut()}
                      className="block py-2 md:py-0 text-left w-full"
                      type="button"
                    >
                      Sign Out
                    </button>
                  </li>
                  <li className="nav-item nav-link">
                    <Link
                      href="/books/add-book"
                      className="block py-2 md:py-0"
                    >
                      Add a Book
                    </Link>
                  </li>
                  <li className="nav-item nav-link">
                    <Link
                      href="/books/list-books"
                      className="block py-2 md:py-0"
                    >
                      List Books
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item nav-link">
                    <Link
                      href="/signin"
                      className="block py-2 md:py-0"
                    >
                      Sign In
                    </Link>
                  </li>
                  <li className="nav-item nav-link">
                    <Link
                      href="/signup"
                      className="block py-2 md:py-0"
                    >
                      Sign Up
                    </Link>
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
