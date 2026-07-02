"use client";

import Card from "./ui/Card";
import type { Prisma } from "@/app/generated/prisma/client";
import Image from "next/image";

type User = Prisma.UserGetPayload<{
  include: {
    emails: true;
    accounts: true;
    twofactors: true;
  };
}>;

interface UserCardProps {
  user: User;
  twoFactorEnabled: boolean;
}

export default function UserCard({ user, twoFactorEnabled }: UserCardProps) {
  return (
    <Card>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Profile</h2>

        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p>{user.name}</p>
        </div>
        <div>
          <Image
            src={user.image!}
            alt="Profile Image"
          />
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p>{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Joined: {user.createdAt.toDateString()}</p>
        </div>
        <div>
          <p>2 Factor Authentication Status: <span>{twoFactorEnabled}</span></p>
        </div>
      </div>
    </Card>
  );
}