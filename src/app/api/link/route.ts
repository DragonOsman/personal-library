import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/app/lib/db";

export const POST = async (req: NextRequest) => {
  const  { token } = await req.json();
  if (!token) {
    return NextResponse.json({ error: "Missing Token" }, { status: 400 });
  }

  const pendingAccountLink = await prisma.pendingAccountLink.findUnique({
    where: { token }
  });

  if (!pendingAccountLink) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }


  const user = await prisma.user.findUnique({
    where: { email: pendingAccountLink.email },
    include: { accounts: true }
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  const existingAccount = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: pendingAccountLink.provider,
        providerAccountId: pendingAccountLink.providerId
      }
    }
  });

  if (!existingAccount) {
    await prisma.account.create({
      data: {
        userId: user.id,
        provider: pendingAccountLink.provider,
        providerAccountId: pendingAccountLink.providerId,
        type: "oauth"
      }
    });
  }

  await prisma.pendingAccountLink.delete({
    where: { id: pendingAccountLink.id }
  });

  return NextResponse.json({ success: true }, { status: 200 });
};