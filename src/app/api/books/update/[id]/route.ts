import { NextResponse, NextRequest } from "next/server";
import prisma from "@/src/app/lib/db";
import { auth } from "@/src/auth";

export const PUT = async (req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const bookId = (await params).id;
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ status: 401, message: "Unauthorized"});
  }

  try {
    const books = await prisma.book.findMany({
      where: { userId: user.id }
    });

    if (books.length === 0) {
      return NextResponse.json({ status: 404, message: "No books found" });
    } else if (!books) {
      return NextResponse.json({ status: 500, message: "Failed to retrieve books" });
    }

    const currentBooks = books;
    const bookIndex = currentBooks.findIndex(book => book.id === bookId);

    if (bookIndex === -1) {
      return NextResponse.json({ status: 404, message: "Book not found" });
    }

    const updates = await req.json();

    const updatedBook = {
      ...currentBooks[bookIndex],
      ...updates
    };

    currentBooks[bookIndex] = updatedBook;

    await prisma.book.update({
      where: { id: bookId },
      data: updatedBook
    });

    return NextResponse.json({ status: 200, message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ status: 500, message: `Failed to update book: ${errorMessage}` });
  }
};