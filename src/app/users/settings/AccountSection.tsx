"use client";

import { Prisma } from "@/app/generated/prisma/client";
import { authClient } from "@/auth-client";
import { useState } from "react";

type User = Prisma.UserGetPayload<{
  include: {
    emails: true;
    accounts: true;
    twofactors: true;
  };
}>;

interface AccountSectionProps {
  user: User;
}

export default function AccountSection({ user }: AccountSectionProps) {
  return (
    <dl className="space-y-4">
      <dt className="text-sm text-gray-500">Name</dt>
      <dd>{user.name}</dd>
      <dt className="text-sm text-gray-500">Email</dt>
      <dd>{user.email}</dd>
      <dt className="text-sm text-gray-500">Email Verified</dt>
      <dd>{user.emailVerified ? "Yes" : "No"}</dd>
      <dt className="text-sm text-gray-500">Bio</dt>
      <dd>{user.bio || "No bio available."}</dd>
      <dt className="text-sm text-gray-500">Joined</dt>
      <dd>{new Date(user.createdAt).toLocaleDateString() || "No joined date available"}</dd>
    </dl>
  );
}