// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

"use client";

import logo from "@/public/images/logo.png";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { authClient } from "@/src/auth-client";
import UserButton from "./UserButton";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = authClient.useSession();

  const isAuthenticated = !!(data?.session && data?.user);

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
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
          <span className="hidden sm:block font-semibold text-lg text-gray-800">
            DragonOsman Personal Library
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link href="/" className="btn btn-ghost btn-sm">
                Home
              </Link>
              <Link href="/books/add-book" className="btn btn-primary btn-sm">
                Add Book
              </Link>
              <Link href="/books/list-books" className="btn btn-ghost btn-sm">
                My Books
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-2xl p-2 text-gray-700"
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
        <div className="px-4 pb-4 space-y-2 bg-white border-t">
          {isAuthenticated ? (
            <>
              <Link href="/" className="btn btn-ghost w-full justify-start">
                Home
              </Link>
              <Link href="/books/add-book" className="btn btn-primary w-full">
                Add Book
              </Link>
              <Link href="/books/list-books" className="btn btn-ghost w-full justify-start">
                My Books
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="btn btn-ghost w-full">
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn btn-primary w-full">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
