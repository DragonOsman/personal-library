// Copyright (c) 2026 Your Name
// Licensed under the GPL v3

import SignIn from "@/src/app/components/Signin";
import { Metadata } from "next";
import { getRouteTitle, getRouteKeywords } from "@/src/app/lib/routeTitles";

export const generateMetadata = (): Metadata => {
  const pathname = "/auth/signin";
  const title = getRouteTitle(pathname);
  const keywords = getRouteKeywords(pathname);

  return {
    title,
    keywords
  };
};

const SignInPage = () => {
  return <SignIn />;
};

export default SignInPage;