import SettingsPanel from "./SettingsPanel";
import { Metadata } from "next";
import { getRouteTitle, getRouteKeywords } from "@/src/app/lib/routeTitles";

export const generateMetadata = (): Metadata => {
  const pathname = "/users/settings";
  const title = getRouteTitle(pathname);
  const keywords = getRouteKeywords(pathname);

  return {
    title,
    keywords
  };
};

const SettingsPageContent = () => {
  return <SettingsPanel />;
};

export default function SettingsPage() {
  return <SettingsPageContent />;
}