// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

"use client";

import { authClient } from "@/src/auth-client";
import { useRouter } from "next/navigation";

const SignOut = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    const { data, error } = await authClient.signOut();

    if (data && data.success) {
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
      className="btn btn-ghost btn-sm"
    >
      Sign Out
    </button>
  );
};

export default SignOut;