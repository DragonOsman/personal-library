// Copyright (c) 2026 Your Name
// Licensed under the GPL v3

import SettingsClient from "./SettingsClient";
import { Metadata } from "next";
import { getRouteTitle, getRouteKeywords } from "@/lib/routeTitles";
import { getCurrentUser } from "@/app/users/settings/actions";
import { redirect } from "next/navigation";

export const generateMetadata = (): Metadata => {
  const pathname = "/users/settings";
  const title = getRouteTitle(pathname);
  const keywords = getRouteKeywords(pathname);

  return {
    title,
    keywords
  };
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin");
  }
  return user && <SettingsClient user={user} />;
}