// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

import { Metadata } from "next";
import { getRouteTitle, getRouteKeywords } from "@/src/lib/routeTitles";
import Image from "next/image";
const logo = "@/images/logo.png";

export const generateMetadata = (): Metadata => {
  const pathname = "/";
  const title = getRouteTitle(pathname);
  const keywords = getRouteKeywords(pathname);

  return {
    title,
    keywords
  };
};

const Page = () => {
  return (
    <div className="space-y-6 text-center">
      <Image
        src={logo}
        alt="Logo"
        width={50}
        height={50}
        className="w-12 h-12 object-contain"
        priority
      />
      <h1 className="text-4xl font-bold">
        DragonOsman Personal Library App
      </h1>

      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Organize, track, and manage your personal book collection with ease.
      </p>

      <div className="flex justify-center gap-4 mt-6">
        <a href="/auth/signup" className="btn btn-primary">
          Get Started
        </a>
        <a href="/auth/signin" className="btn btn-outline">
          Sign In
        </a>
      </div>

      <div className="text-sm text-gray-500 mt-8 space-y-2">
        <p>
          Open-source under GPL v3 •
          <a
            href="https://github.com/osman-zakir/personal-library"
            target="_blank"
            className="link
            link-primary ml-1"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>

        <p>
          <a href="/terms-of-service" className="link">Terms</a> •{" "}
          <a href="/privacy-policy" className="link">Privacy</a>
        </p>
      </div>
    </div>
  );
};

export default Page;