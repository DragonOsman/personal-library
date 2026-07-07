"use client";

import { Prisma } from "@/app/generated/prisma/client";

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
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
      <dt className="font-medium text-gray-500">Name</dt>
      <dd>{user.name}</dd>

      <dt className="font-medium text-gray-500">Email</dt>
      <dd>{user.email}</dd>

      <dt className="font-medium text-gray-500">Email Verified</dt>
      <dd>{user.emailVerified ? "Yes" : "No"}</dd>

      <dt className="font-medium text-gray-500">Bio</dt>
      <dd>{user.bio || "No bio available."}</dd>

      <dt className="font-medium text-gray-500">Joined</dt>
      <dd>{new Date(user.createdAt).toLocaleDateString()}</dd>
    </dl>
  );
}