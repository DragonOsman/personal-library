import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/app/lib/db";
import { auth } from "@/src/auth";

export const DELETE = async (req: NextRequest,
  { params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Please log in first" }, { status: 401 });
  }
  const user = session.user;
  const bookId = (await params).id;

  if (!user) {
    return NextResponse.json({ message: "Please log in first" }, { status: 401 });
  }

  try {
    const books = await prisma.book.findMany({
      where: { userId: user.id }
    });

    if (books.length === 0 || !books) {
      return NextResponse.json({ status: 404, message: "Library not found for user" });
    }
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex === -1) {
      return NextResponse.json({ status: 404, message: "Book not found" });
    }

      books.splice(bookIndex, 1);
      await prisma.book.delete({
        where: { id: bookId }
      });
      return NextResponse.json({ status: 200, message: "Book deleted successfully" });
    } catch (err) {
      return NextResponse.json({
        status: 500,
        message: `An unexpected error occurred: ${(err as Error).message}` }
      );
    }
};
