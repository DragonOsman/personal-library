// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

import ResetPassword from "@/app/components/ResetPassword";
import { Metadata } from "next";
import { getRouteTitle, getRouteKeywords } from "@/lib/routeTitles";
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

export default function ResetPasswordPage({
  searchParams
}: {
  searchParams: { token?: string };
}) {
  if (!searchParams?.token) {
    notFound();
  }

  return <ResetPassword token={searchParams.token} />;
}