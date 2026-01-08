"use client";

import { authClient } from "@/src/auth-client";
import { useRouter } from "next/router";

const SignOut = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    const { data, error } = await authClient.signOut();

    if (data && data.success) {
      alert("Logged out successfully!");
      router.push("/auth/signin");
    } else if (error) {
      alert(`An error occurred when attempting to log out: ${error.message}`);
    }
  };

  return (
    <button
      type="button"
      title="Sign Out"
      onClick={handleSignOut}
      className="bg-gray-700 text-white p-2 rounded hover:bg-gray-800"
    >
      Sign Out
    </button>
  );
};

export default SignOut;