// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

import RequestPasswordReset from "@/src/app/components/RequestPasswordReset";
import { Metadata } from "next";
import { getRouteTitle, getRouteKeywords } from "@/src/lib/routeTitles";

export const generateMetadata = (): Metadata => {
  const pathname = "/auth/reset-password-request";
  const title = getRouteTitle(pathname);
  const keywords = getRouteKeywords(pathname);

  return {
    title,
    keywords
  };
};

export default function ResetPasswordRequestPage() {
  return <RequestPasswordReset />;
}