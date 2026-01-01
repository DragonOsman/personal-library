import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/app/lib/db";
import { auth } from "@/src/auth";

export const GET = async (req: NextRequest) => {
  const session = await auth.api.getSession({
    headers: req.headers
  });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id }
  });

  return NextResponse.json(accounts);
};

export const DELETE = async (req: NextRequest) => {
  const session = await auth.api.getSession({
    headers: req.headers
  });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { provider, providerAccountId } = await req.json();
  if (!provider || !providerAccountId) {
    return NextResponse.json(
      { error: "Provider and providerAccountId are required" },
      { status: 400 }
    );
  }

  await prisma.account.delete({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId
      }
    }
  });

  return NextResponse.json({ success: true, message: "Account unlinked successfully" }, { status: 200 });
};