// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

"use client";

import logo from "@/public/images/logo.png";
import Image from "next/image";
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
  const isActive = (path: string) => pathname === path;

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
              <Link href="/" className={`btn btn-sm ${isActive("/") ? "bg-white/20 text-white" : "btn-ghost text-white hover:bg-white/10"} transition-transform duration-150 active:scale-95`}>
                Home
              </Link>
              <Link href="/books/add-book" className={`btn btn-sm ${isActive("/books/add-book") ? "bg-brand-accent text-white" : "bg-brand-secondary text-white hover:bg-brand-accent"} transition-transform duration-150 active:scale-95`}>
                Add Book
              </Link>
              <Link href="/books/list-books" className={`btn btn-sm ${isActive("/books/list-books") ? "bg-white/20 text-white" : "btn-ghost text-white hover:bg-white/10"} transition-transform duration-150 active:scale-95`}>
                My Books
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="btn btn-sm btn-ghost justify-start text-white border-none hover:bg-white/10 transition-transform duration-150 active:scale-95">
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn btn-sm bg-brand-secondary text-white hover:bg-brand-accent border-none transition-transform duration-150 active:scale-95">
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
        <div className="px-4 pb-4 space-y-2 bg-brand-primary border-t border-white/10">
          {isAuthenticated ? (
            <>
              <Link href="/" className={`btn btn-ghost w-full justify-start ${isActive("/") ? "bg-white/20 text-white" : "btn-ghost text-white hover:bg-white/10"} transition-transform duration-150 active:scale-95`}>
                Home
              </Link>
              <Link href="/books/add-book" className={`btn w-full ${isActive("/books/add-book") ? "bg-brand-accent text-white" : "bg-brand-secondary text-white hover:bg-brand-accent"} transition-transform duration-150 active:scale-95`}>
                Add Book
              </Link>
              <Link href="/books/list-books" className={`btn btn-ghost w-full justify-start ${isActive("/books/list-books") ? "bg-white/20 text-white" : "btn-ghost text-white hover:bg-white/10"} transition-transform duration-150 active:scale-95`}>
                My Books
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="btn btn-ghost justify-start text-white hover:bg-white/10 transition-transform duration-150 active:scale-95">
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn bg-brand-secondary text-white hover:bg-brand-accent border-none transition-transform duration-150 active:scale-95">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
