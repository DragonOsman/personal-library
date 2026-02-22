import RequestPasswordReset from "@/src/app/components/RequestPasswordReset";
import { Metadata } from "next";
import { getRouteTitle, getRouteKeywords } from "@/src/app/lib/routeTitles";

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