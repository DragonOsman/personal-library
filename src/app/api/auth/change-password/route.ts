import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "../../../../app/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const MAX_SESSION_AGE = 10 * 60 * 1000;  // 10 minutes
  const lastAuth = session.user.lastLoginAt;
  if (lastAuth && Date.now() - new Date(lastAuth).getTime() > MAX_SESSION_AGE) {
    return NextResponse.json({ message: "Re-authentication required" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { password: true }
  });

  if (!user || !user.password) {
    return NextResponse.json({ message: "User not found or no password set" }, { status: 404 });
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password.hash);

  if (!isPasswordValid) {
    return NextResponse.json({ message: "Invalid current password" }, { status: 401 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.password.update({
    where: { userId: user.id },
    data: { hash: hashedPassword }
  });

  return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
}
