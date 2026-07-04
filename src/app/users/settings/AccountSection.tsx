"use client";

import { Prisma } from "@/app/generated/prisma/client";
import { authClient } from "@/auth-client";
import type { OAuth2UserInfo } from "better-auth";
import { useState } from "react";

type User = Prisma.UserGetPayload<{
  include: {
    emails: true;
    accounts: true;
    twofactors: true;
  };
}>;

export default async function AccountSection() {
  const accountInfo = await authClient.accountInfo();
  const { data, error } = accountInfo;
  const [customError, setCustomError] = useState("");

  let user: OAuth2UserInfo | User | null = null;
  if (data) {
    user = data.user;
  }
  if (user === null) {
    setCustomError("Please log in first");
    return <p className="text-error">{customError}</p>;
  } else if (error) {
    console.error(`An error occurred trying to get user info: ${error.message && error.message}`);
  }
  return (
    <dl className="space-y-4">
      <dt className="text-sm text-gray-500">Name</dt>
      <dd>{user.name}</dd>
      <dt className="text-sm text-gray-500">Email</dt>
      <dd>{user.email}</dd>
      <dt className="text-sm text-gray-500">Email Verified</dt>
      <dd>{user.emailVerified ? "Yes" : "No"}</dd>
      <dt className="text-sm text-gray-500">Bio</dt>
      <dd>{(user as User).bio || "No bio available."}</dd>
      <dt className="text-sm text-gray-500">Joined</dt>
      <dd>{new Date((user as User).createdAt).toLocaleDateString() || "No joined date available"}</dd>
    </dl>
  );
}