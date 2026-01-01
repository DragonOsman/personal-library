import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/src/auth";
import prisma from "@/src/app/lib/db";

export const GET = async (req: NextRequest) => {
  const session = await auth.api.getSession({
    headers: req.headers
  });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session.user?.id) {
    return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      emails: true,
      image: true,
      mfaEnabled: true,
      autoMergeAuth: true,
      accounts:{
        select: {
          provider: true,
          providerAccountId: true
        }
      }
    }
  });

  return NextResponse.json(user);
};