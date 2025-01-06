"use client";

import logo from "../../../public/images/logo.png";
import Image from "next/image";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from "@clerk/nextjs";
import {
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";

const Header = () => {
  return (
    <header>
      <div className="header-container mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <Image
          src={logo.src}
          alt="Logo"
          height={logo.height}
          width={logo.width}
          className="dragon-logo h-8 w-auto"
        />
        <div className="relative flex h-16 items-center justify-between">
          <button className="menu-button group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" type="button" title="Menu Button">
            <Bars3Icon className="h-6 w-6 block size-6 group-data-[open]:hidden" aria-hidden="true" />
            <XMarkIcon className="h-6 w-6 hidden size-6 group-data-[open]:block" aria-hidden="true" />
          </button>
          <nav className="nav-container">
            <ul className="flex h-16 items-center justify-between">
              <SignedOut>
                <li className="nav-item">
                  <SignInButton>
                    <button type="button" className="sign-in-button" title="Sign In">
                      Sign In
                    </button>
                  </SignInButton>
                </li>
                <li className="nav-item">
                  <SignUpButton>
                    <button type="button" className="sign-up-button" title="Sign Up">
                      Sign Up
                    </button>
                  </SignUpButton>
                </li>
              </SignedOut>
              <SignedIn>
                <UserButton userProfileMode="navigation" userProfileUrl="/" />
                <li className="nav-item">
                  <SignOutButton>
                    <button type="button" className="sign-out-button" title="Sign Out">
                      Sign Out
                    </button>
                  </SignOutButton>
                </li>
                <li className="nav-item">
                  <UserButton />
                </li>
              </SignedIn>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
