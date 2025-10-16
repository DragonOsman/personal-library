"use client";

import logo from "../../../public/images/logo.png";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const handleToggle = () => setIsOpen(s => !s);

  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-[#2e2f33] z-50 shadow-md">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={logo}
            alt="Logo"
            width={50}
            height={50}
            className="w-12 h-12 object-contain"
            priority
          />
          <span className="hidden sm:inline text-white font-semibold">Personal Library</span>
        </Link>

        <button
          type="button"
          className="md:hidden text-white text-2xl p-2"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={handleToggle}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav
          className={`${
            isOpen
              ? "absolute top-full left-0 w-full bg-[#2e2f33] md:static md:bg-transparent"
              : "hidden md:block"
          } md:block`}
        >
          <ul className="flex flex-col md:flex-row md:items-center md:space-x-6 p-4 md:p-0">
            {isAuthenticated ? (
              <>
                <li>
                  <Link href="/" className="block text-white py-20 px-20 md:py-0 md:px-0 rounded hover:bg-slate-700">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="block text-white py-20 md:py-0 px-20 rounded hover:bg-slate-700">
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-20 py-20 md:py-0 rounded bg-[#287098] text-white hover:bg-[#205979] md:w-auto md:inline-block"
                    type="button"
                  >
                    Sign Out
                  </button>
                </li>
                <li>
                  <Link href="/books/add-book" className="block text-white py-20 md:py-0 px-20 rounded hover:bg-slate-700">
                    Add a Book
                  </Link>
                </li>
                <li>
                  <Link href="/books/list-books" className="block text-white py-20 md:py-0 px-20 rounded hover:bg-slate-700">
                    List Books
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/auth/signin" className="block text-white py-20 md:py-0 px-20 md:py-0 rounded hover:bg-slate-700">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" className="block text-white py-20 md:py-0 px-20 rounded hover:bg-slate-700">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
