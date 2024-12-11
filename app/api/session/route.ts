import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const GET = async () => {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse(
      JSON.stringify({ status: "fail", message: "You are not logged in" }),
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: !!session,
    session
  });
};