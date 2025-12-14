"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";
import PasswordSection from "./PasswordSection";
import BooksSection from "./BooksSection";
import MfaSection from "./MfaSection";
import OAuthSection from "./OAuthSection";

export default function ProfileClientPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [loading, router, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    // redirect in progress
    return null;
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Profile</h1>

      <section className="mt-4">
        <h2 className="text-lg font-semibold">
          Welcome{user.name ? `, ${user.name}` : ""}
        </h2>
        <p>Email: {user.email}</p>
      </section>

      <MfaSection enabled={user.mfaEnabled ?? false} />
      <OAuthSection />
      <PasswordSection />
      <BooksSection />
    </>
  );
}