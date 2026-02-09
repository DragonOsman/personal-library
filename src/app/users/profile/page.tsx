import ProfileClientPage from "./ProfileClient";
import { Metadata } from "next";
import { getRouteTitle, getRouteKeywords } from "@/src/app/lib/routeTitles";

export const generateMetadata = (): Metadata => {
  const pathname = "/users/profile";
  const title = getRouteTitle(pathname);
  const keywords = getRouteKeywords(pathname);

  return {
    title,
    keywords
  };
};

export const ProfilePage = async () => {
  return <ProfileClientPage />;
};

export default ProfilePage;
