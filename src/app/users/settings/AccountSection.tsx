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
    <dl className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt className="font-medium text-gray-500">Name</dt>
        <dd className="break-words md:text-right">{user.name}</dd>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt className="font-medium text-gray-500">Email</dt>
        <dd className="break-all md:text-right">{user.email}</dd>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt className="font-medium text-gray-500">Email Verified</dt>
        <dd className="md:text-right">
          {user.emailVerified ? "Yes" : "No"}
        </dd>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt className="font-medium text-gray-500">Bio</dt>
        <dd className="break-words md:text-right">
          {user.bio || "No bio available."}
        </dd>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt className="font-medium text-gray-500">Joined</dt>
        <dd className="md:text-right">
          {new Date(user.createdAt).toLocaleDateString()}
        </dd>
      </div>
    </dl>
  );
}