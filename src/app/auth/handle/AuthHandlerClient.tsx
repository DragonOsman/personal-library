"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthHandlerClient({
  type,
  redirect
}: {
  type: string;
  redirect?: string;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!redirect) {
      router.replace("/auth/signin");
      return;
    }

    window.location.href = redirect;
  }, [redirect, router]);

  const messages: Record<string, string> = {
    "magic-link": "Signing you in...",
    "verify-email": "Verifying your email...",
    "oauth": "Signing you in with your provider..."
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="card bg-base-100 shadow-md p-6 text-center">
        <h1 className="text-lg font-semibold mb-2">
          {messages[type] || "Processing..."}
        </h1>
        <p className="text-sm opacity-70">
          Please wait while we complete the process.
        </p>
      </div>
    </div>
  );
}