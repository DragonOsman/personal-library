import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/app/lib/db";
import { auth } from "@/src/auth";

export const DELETE = async (req: NextRequest,
  { params }: { params: { id: string } }) => {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Please log in first" }, { status: 401 });
  }
  const user = session.user;
  const userId = session.user.id;
  const bookId = params.id;

  if (!user) {
    return NextResponse.json({ message: "Please log in first" }, { status: 401 });
  }

  try {
    await prisma.book.findUnique({
      where: {
        id: bookId,
        userId
      }
    });
    prisma.book.delete({
      where: {
        id: bookId
      }
    });

    return NextResponse.json({ status: 200, message: "Book deleted successfully" });

  } catch (err) {
    return NextResponse.json({
      status: 500,
      message: `An unexpected error occurred: ${(err as Error).message}` }
    );
  }
};
