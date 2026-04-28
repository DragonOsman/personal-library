// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

import ResetPassword from "@/src/app/components/ResetPassword";
import { Metadata } from "next";
import { getRouteTitle, getRouteKeywords } from "@/src/lib/routeTitles";

export const generateMetadata = (): Metadata => {
  const pathname = "/auth/reset-password";
  const title = getRouteTitle(pathname);
  const keywords = getRouteKeywords(pathname);

  return {
    title,
    keywords
  };
};

export default function ResetPasswordPage({
  params
}: {
  params: { token: string };
}) {
  return <ResetPassword token={params.token} />;
}