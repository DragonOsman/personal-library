"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

const AuthErrorPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration. Check your environment variables and Auth.js setup.",
    AccessDenied: "Access was denied. You may not have permission to view this page.",
    Verification: "The verification token has expired or has already been used.",
    CallbackError: "There was an error during sign-in. Please try again.",
    Default: "An unexpected authentication error occurred."
  };

  const errorMessage = errorMessages[error as string] || errorMessages.Default;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="p-8 bg-white rounded-lg shadow-md border border-gray-200 max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-gray-600 mb-6">{errorMessage}</p>

        {error && (
          <div className="mb-6 p-2 bg-gray-100 rounded text-xs font-mono text-gray-500">
            <p>Error Code: {error}</p>
          </div>
        )}

        <Link
          href="/auth/signin"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
};

export default AuthErrorPage;