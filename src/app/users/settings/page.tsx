// Copyright (c) 2026 Your Name
// Licensed under the GPL v3

import SettingsPanel from "./SettingsPanel";
import { Metadata } from "next";
import { getRouteTitle, getRouteKeywords } from "@/src/lib/routeTitles";

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
  return <SettingsPanel />;
}