import { NextResponse } from "next/server";
import prisma from "../../lib/db";
import { auth } from "../../../auth";

export const GET = async () => {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Please log in first" }, { status: 401 });
  }
  const user = session.user;

  if (!user) {
    return NextResponse.json({ message: "Please log in first" }, { status: 401 });
  }
  const userId: string = user.id;

  try {
    const books = await prisma.book.findMany({
      where: { userId }
    });

    if (books.length === 0) {
      return NextResponse.json({ message: "No books found in your library" }, { status: 404 });
    } else if (!books) {
      return NextResponse.json({ message: "Failed to retrieve books from library" }, { status: 500 });
    }

    return NextResponse.json({ books }, { status: 200});
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error fetching books for user ${user.name} (ID: ${userId}): ${errorMessage}`, error);
    return NextResponse.json({ message: "Failed to retrieve books from library" }, { status: 500 });
  }
};
