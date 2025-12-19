import { NextResponse, NextRequest } from "next/server";
import prisma from "@/src/app/lib/db";
import { auth } from "@/src/auth";

export const PUT = async (req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const bookId = params.id;
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ status: 401, message: "Unauthorized"});
  }
  const userId = session?.user.id;

  try {
    await prisma.book.findUnique({
      where: {
        id: bookId,
        userId
      }
    });
    const updates = await req.json();
    const allowedFields = [
      "title",
      "author",
      "authors",
      "isbn",
      "description",
      "publishedDate",
      "pageCount",
      "categories",
      "language",
      "averageRating",
      "ratingsCount"
    ];
    const data: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        data[field] = updates[field];
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updatedBook = await prisma.book.update({
      where: {
        id: bookId,
        userId
      },
      data
    });

    return NextResponse.json({ status: 200, message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ status: 500, message: `Failed to update book: ${errorMessage}` });
  }
};