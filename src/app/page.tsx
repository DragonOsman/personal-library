// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

import { Metadata } from "next";
import { getRouteTitle, getRouteKeywords } from "@/src/app/lib/routeTitles";

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
    <div className="Homepage">
      <h1>Welcome to the Personal Library App</h1>
      <p className="app-info">
        This app allows you to manage your personal library of books. You can add books and organize your collection. <a href="/auth/signup">Sign up</a> or <a href="/auth/signin">sign in</a> to get started!
      </p>
      <p>
        This project is open source and licensed under the GPL v3. You can find the source code on <a href="https://github.com/osman-zakir/personal-library" target="_blank" rel="noopener noreferrer">GitHub</a>.
      </p>
      <p>
        If interested, you can also view the <a href="/terms-of-service">Terms of Service</a> and <a href="/privacy-policy">Privacy Policy</a>.
      </p>
    </div>
  );
};

export default Page;