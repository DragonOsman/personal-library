import { Suspense } from "react";
import AuthErrorContent from "./content";
import { getRouteTitle, getRouteKeywords } from "@/src/app/lib/routeTitles";

export const generateMetadata = () => {
  const pathname = "/auth/error";
  const title = getRouteTitle(pathname);
  const keywords = getRouteKeywords(pathname);

  return {
    title,
    keywords
  };
};

const AuthErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <Suspense fallback={<div>Loading error details...</div>}>
        <AuthErrorContent />
      </Suspense>
    </div>
  );
};

export default AuthErrorPage;