"use client";

import Card from "./ui/Card";
import { authClient } from "@/auth-client";

export default function UserCard() {
  const { data, error, isPending } = authClient.useSession();

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (!data?.user) {
    return <p>Please log in first.</p>;
  }

  const user = data.user;

  const customError = error ?? null;

  return (
    <Card>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Profile</h2>

        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p>{user.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p>{user.email}</p>
        </div>

        {customError && (
          <p className="text-red-600">{customError.message}</p>
        )}
      </div>
    </Card>
  );
}