"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/src/auth-client";
import ProfileSideBar from "./ProfileSideBar";
import PasswordSection from "./PasswordSection";
import BooksSection from "./BooksSection";
import TwoFASection from "./TwoFASection";
import OAuthSection from "./OAuthSection";

export default function ProfileClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session } = authClient.useSession();

  const toggleLoading = () => setLoading(!loading);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!session?.session && !session?.user) {
      router.push("/auth/signin");
    }
  }, [router, session?.session, session?.user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!session?.user) {
    // redirect in progress
    return null;
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      {toggleLoading}
      <div className="flex gap-8">
        <ProfileSideBar />

        <div className="flex-1 space-y-12">
          <section id="overview" className="space-y-2">
            <h2 className="text-lg font-semibold">
              Welcome{session?.user.name ? `, ${session?.user.name}` : ""}
            </h2>
            <p>Email: {session?.user.email}</p>
          </section>

          <section id="authentication" className="space-y-10">
            <TwoFASection enabled={session?.user.twoFactorEnabled ?? false} />
            <OAuthSection />
            <PasswordSection />
          </section>

          <BooksSection />
        </div>
      </div>
    </>
  );
}