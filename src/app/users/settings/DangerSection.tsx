"use client";

import { authClient } from "@/auth-client";

export default function DangerZoneSection() {
  return (
    <button
      type="button"
      title="Delete account"
      className="btn btn-error"
      onClick={() => authClient.deleteUser()}
    >
      Delete Account
    </button>
  );
}