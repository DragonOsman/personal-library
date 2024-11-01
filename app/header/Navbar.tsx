"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Image from "next/image";
import logo from "../../public/images/logo.png";

const Navbar = () => {
  const [navVisilbility, setNavVisibility] = useState(false);

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setNavVisibility(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const links = [{
    id: 1,
    link: "home"
  }, {
    id: 2,
    link: "login"
  }];

  return (
    <nav className="flex justify-between items center w-full h-20 px-4 text-white bg-black fixed nav">
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
          {links.map((linkObj) => (
            <li
              key={linkObj.id}
              className="nav-links px-4 cursor-pointer capitalize font-medium"
            >
              <Link href={linkObj.link}>{linkObj.link}</Link>
            </li>
          ))}
        </ul>
        <div
          className="cursor-pointer pr-4 z-10 text-gray-500 md:hidden"
          onClick={() => setNavVisibility(!navVisilbility)}
        >
          {navVisilbility ? <FaTimes size={30} /> : <FaBars size={30} />}
        </div>
        {navVisilbility && (
          <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full">
            {links.map((linkObj) => (
              <li
                className="cursor-pointer px-4 capitalize-py-6 text-4xl"
                key={linkObj.id}
              >
                <Link href={linkObj.link} onClick={() => setNavVisibility(!navVisilbility)}>
                  {linkObj.link}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;