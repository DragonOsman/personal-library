import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/db";
import { auth } from "@/src/auth";

export const DELETE = async () => {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ body: { error:"Unauthorized" } }, { status: 401 });
  }
  const user = session.user;

  if (!user) {
    return NextResponse.json({
      status: 401,
      body: { error: "Unauthorized" }
    });
  }

  try {
    await prisma.user.delete({
      where: { id: user.id }
    });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: `Error deleting user: ${error}`
    });
  }
};