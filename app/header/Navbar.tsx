"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Image from "next/image";
import logo from "../../public/images/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  let isLoggedIn = false;
  if (session) {
    isLoggedIn = true;
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-black p-4">
      <div className="flex container mx-auto flex-col lg:flex-row justify-between items-center">
        <div className="mb-4 hover:cursor-pointer">
          <Image
            src={logo.src}
            alt="dragon logo"
            className="dragon-logo place-self-start"
            width={50}
            height={50}
          />
        </div>
        <div className="lg:hidden">
          <button
            type="button"
            title="toggle navbar"
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
          <ul
            className={`lg:flex flex-col lg:flex-row ${isOpen ? "block" : "hidden"} lg:space-x-4 lg:mt-0 mt-4 flex-col items-center text-xl`}
          >
            <>
              {isLoggedIn ? (
                <>
                  <li>
                    <Link href="/api/auth/register">Register</Link>
                  </li>
                  <li>
                    <Link href="/api/auth/login">Login</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      title="logout button"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;