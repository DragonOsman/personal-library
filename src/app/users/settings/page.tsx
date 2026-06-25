// Copyright (c) 2026 Your Name
// Licensed under the GPL v3

import SettingsClient from "./SettingsPanel";
import { Metadata } from "next";
import { getRouteTitle, getRouteKeywords } from "@/lib/routeTitles";

export const generateMetadata = (): Metadata => {
  const pathname = "/users/settings";
  const title = getRouteTitle(pathname);
  const keywords = getRouteKeywords(pathname);

  return {
    title,
    keywords
  };
};

export default function SettingsPage() {
  return <SettingsClient />;
}