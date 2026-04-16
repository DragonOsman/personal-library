// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

"use client";

import Image from "next/image";
import logo from "@/public/images/logo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { authClient } from "@/src/auth-client";
import UserButton from "./UserButton";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = authClient.useSession();
  const pathname = usePathname();

  const isAuthenticated = !!(data?.session && data?.user);
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const navBtn = (
    active: boolean,
    primary = false,
    mobile = false
) =>
  `btn ${
    mobile
      ? "btn-block justify-start rounded px-3 py-3"
      : "btn-sm px-3 py-3 rounded"
    } ${
    primary
      ? active
        ? "bg-brand-accent text-white ring-2 ring-white/20"
        : "bg-brand-secondary text-white hover:bg-brand-accent"
      : active
        ? "bg-white/20 text-white"
        : "btn-ghost text-white hover:bg-white/10"
  } transition-transform duration-150 active:scale-95`;

  const handleNavClick = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-brand-primary text-white shadow-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={logo}
            alt="Logo"
            width={50}
            height={50}
            className="object-contain"
            priority
          />
          <span className="hidden sm:block text-lg text-white font-semibold">
            DragonOsman Personal Library
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                href="/"
                className={navBtn(isActive("/"))}
              >
                Home
              </Link>
              <Link
                href="/books/add-book"
                className={navBtn(isActive("/books/add-book"), true)}
              >
                Add Book
              </Link>
              <Link
                href="/books/list-books"
                className={navBtn(isActive("/books/list-books"))}
              >
                My Books
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className={navBtn(isActive("/auth/signin"))}
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className={navBtn(isActive("/auth/signup"), true)}
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-2xl p-2 text-white"
          onClick={() => setIsOpen((s) => !s)}
          aria-label="Toggle menu"
          type="button"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 flex flex-col gap-2 bg-brand-primary border-t border-white/10">
          {isAuthenticated ? (
            <>
              <Link
                href="/"
                className={navBtn(isActive("/"), false, true)}
                onClick={handleNavClick}
              >
                Home
              </Link>
              <Link
                href="/books/add-book"
                className={navBtn(isActive("/books/add-book"), true, true)}
                onClick={handleNavClick}
              >
                Add Book
              </Link>
              <Link
                href="/books/list-books"
                className={navBtn(isActive("/books/list-books"), false, true)}
                onClick={handleNavClick}
              >
                My Books
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className={navBtn(isActive("/auth/signin"), false, true)}
                onClick={handleNavClick}
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className={navBtn(isActive("/auth/signup"), true, true)}
                onClick={handleNavClick}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
