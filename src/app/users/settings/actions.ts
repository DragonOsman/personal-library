"use server";
import { auth } from "@/src/auth";
import prisma from "@/src/app/lib/db";

export const updateAutoMerge = async (flag: boolean) => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { autoMergeAuth: flag }
  });

  return { success: true };
};

export const addAlternateEmail = async (email: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  email = email.toLowerCase().trim();

  const existingEmail = await prisma.email.findUnique({
    where: { email }
  });

  if (existingEmail) {
    return { success: false, message: "Email already in use" };
  }

  await prisma.email.create({
    data: {
      email,
      userId: session.user.id
    }
  });

  return { success: true };
};

export const unlinkProvider = async (provider: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  await prisma.account.deleteMany({
    where: {
      userId: session.user.id,
      provider
    }
  });

  return { success: true };
};