"use client";

import { authClient } from "@/auth-client";

const SignOut = () => {
  const handleSignOut = async () => {
    const { data, error } = await authClient.signOut();
    return { data, error };
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