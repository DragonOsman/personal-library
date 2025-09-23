import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "../../../lib/db";

export const POST = async (req: NextRequest) => {
  const session = await auth();

  if (!session?.user && !session?.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { enable }: { enable: boolean } = await req.json();
  await prisma.user.update({
    where: { id: session.user.id },
    data: { mfaEnabled: enable }
  });

  return NextResponse.json({
    message: `MFA ${enable ? "enabled" : "disabled"} successfully`
  });
};
