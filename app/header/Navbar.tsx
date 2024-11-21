"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Image from "next/image";
import logo from "../../public/images/logo.png";

const Navbar = () => {
  const [navVisilbility, setNavVisibility] = useState(false);
  const session = useSession();
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setNavVisibility(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isLoggedIn = (session && session.status !== "unauthenticated"
    && session.data
    && session.data.user
  );

  const links = [{
    id: 1,
    link: "/",
    linkText: "Home"
  }, {
    id: 2,
    link: "/api/auth/register",
    linkText: "Register"
  }, {
    id: 3,
    link: "/api/auth/login",
    linkText: "Login"
  }];

  const signoutBtn = <button type="button">Logout</button>;

  const linksShown = [];
  if (isLoggedIn) {
    linksShown.push(links[0]);
  } else if (!isLoggedIn) {
    linksShown.push(links[1]);
    linksShown.push(links[2]);
  }

  return (
    <nav className="flex bg-black absolute top-0 left-0 w-full justify-between items-center h-20 px-4 text-white nav">
      <div className="brand">
        <Image
          src={logo.src}
          alt="dragon logo"
          className="dragon-logo place-self-start"
          width={50}
          height={50}
        />
      </div>
      <div className="links">
        <ul className="hidden md:flex">
          {linksShown.map((linkShown) => (
            <li
              key={linkShown.id}
              className="nav-links px-4 cursor-pointer font-medium"
            >
              <Link href={linkShown.link}>{linkShown.linkText}</Link>
            </li>
          ))}
          {isLoggedIn && (
            <li className="nav-links px-4 cursor-pointer font-medium">
              {signoutBtn}
            </li>)}
        </ul>
        <div
          className="cursor-pointer pr-4 z-10 text-gray-500 md:hidden"
          onClick={() => setNavVisibility(!navVisilbility)}
        >
          {navVisilbility ? <FaTimes size={30} /> : <FaBars size={30} />}
        </div>
        {navVisilbility && (
          <ul className="bg-black flex flex-col justify-items-center content-center absolute is-visible w-full">
            {linksShown.map((linkShown) => (
              <li
                className="cursor-pointer px-4 py-6 nav-links"
                key={linkShown.id}
              >
                <Link href={linkShown.link}>
                  {linkShown.linkText}
                </Link>
              </li>
            ))}
            {isLoggedIn && (
              <li className="nav-links px-4 cursor-pointer font-medium">
                {signoutBtn}
              </li>)}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;