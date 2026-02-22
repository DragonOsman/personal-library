import ResetPassword from "@/src/app/components/PasswordReset";
import { Metadata } from "next";
import { getRouteTitle, getRouteKeywords } from "@/src/app/lib/routeTitles";

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
  return <ResetPassword params={params} />;
}