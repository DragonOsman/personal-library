"use server";

import prisma from "@/lib/db";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { Prisma } from "@/app/generated/prisma/client";

export type User = Prisma.UserGetPayload<{
  include: {
    emails: true;
    accounts: true;
    twofactors: true;
  };
}>;

export async function getCurrentUser(): Promise<User | null | undefined> {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    include: {
      emails: true,
      accounts: true,
      twofactors: true
    }
  });
}

export async function setPrimaryEmail(emailId: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  await prisma.$transaction(async tx => {
    await tx.email.updateMany({
      where: {
        userId: session.user.id
      },
      data: {
        primary: false
      }
    });

    const email = await tx.email.update({
      where: {
        id: emailId
      },
      data: {
        primary: true
      }
    });

    await tx.user.update({
      where: {
        id: session.user.id
      },
      data: {
        email: email.email
      }
    });
  });
}

export async function removeEmail(emailId: string) {
  await prisma.email.delete({
    where: {
      id: emailId
    }
  });
}