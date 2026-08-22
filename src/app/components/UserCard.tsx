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

  const userName = user.name?.trim() || "User";

  const imageUrl =
    user.image?.trim() ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      userName
    )}&rounded=true&size=128`
  ;

  return (
    <Card>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Profile</h2>

        <div className="flex justify-center">
          <div className="avatar">
            <div className="w-32 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
              <Image
                src={imageUrl}
                alt="Profile Image"
                width={128}
                height={128}
                className="h-8 w-8 rounded-full object-cover"
              />
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p>{user.name}</p>
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