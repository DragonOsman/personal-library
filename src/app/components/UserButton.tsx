"use client";

import { authClient } from "@/src/auth-client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SignOut from "./Signout";

const UserButton = () => {
  const { data, error, isPending } = authClient.useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isPending && !data?.session) {
      router.push("/auth/signin");
    }
  }, [data?.session, isPending, router]);

  if (isPending || !data?.session) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(prev => !prev)}
        title="toggle user menu"
        type="button"
        className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
      >
        <Image
          src={data.user.image && data.user.image !== ""
            ? data.user.image
            : "https://ui-avatars.com/api/?name=User&background=random"
          }
          alt={data?.user.name || "User Avatar"}
          className="w-8 h-8 rounded-full"
        />
        <p>{data?.user.name}</p>
        <p>{data?.user.email}{data?.user.emailVerified ? " (verified)" : " (not verified)"}</p>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2w-48 bg-white border rounded shadow-lg z-50">
          <Link
            href="/users/profile"
            className="block px-4 py-2 hover:bg-gray-100"
            onClick={() => setDropdownOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/users/settings"
            className="block px-4 py-2 hover:bg-gray-100"
            onClick={() => setDropdownOpen(false)}
          >
            Settings
          </Link>
          <SignOut />
        </div>
      )}
    </div>
  );
};

export default UserButton;