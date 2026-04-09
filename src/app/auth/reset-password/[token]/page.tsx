// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

import ResetPassword from "@/src/app/components/ResetPassword";
import { Metadata } from "next";
import { getRouteTitle, getRouteKeywords } from "@/src/lib/routeTitles";
import { notFound } from "next/navigation";

export const generateMetadata = (): Metadata => {
  const pathname = "/auth/reset-password";
  const title = getRouteTitle(pathname);
  const keywords = getRouteKeywords(pathname);

  return {
    title,
    keywords
  };
};

export default async function ResetPasswordPage({ params }: { params: { token?: string } }) {
  if (!params.token) {
    notFound();
  }
  return <ResetPassword token={params.token} />;
}