import { currentUser } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import connectionPool from "@/src/app/lib/db";
import { PoolConnection, RowDataPacket } from "mysql2/promise";
import { IBook } from "@/src/app/context/BookContext";

export const PUT = async (req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const bookId = (await params).id;
  const dbConn: PoolConnection = await connectionPool.getConnection();
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ status: 401, message: "Unauthorized"});
  }

  try {
    const [rows] = await dbConn.query<RowDataPacket[]>(
      "SELECT books FROM library WHERE userId = ?",
      [user.id]
    );

    if (rows.length === 0 || !rows[0].books) {
      return NextResponse.json({ status: 404, message: "Library not found" });
    }

    const currentBooks: IBook[] = JSON.parse(rows[0].books as string);
    const bookIndex = currentBooks.findIndex(book => book.id === bookId);

    if (bookIndex === -1) {
      return NextResponse.json({ status: 404, message: "Book not found" });
    }

    const updates = await req.json();

    const updatedBook: IBook = { ...currentBooks[bookIndex] };
    if (updates.title !== undefined) {
      updatedBook.title = updates.title;
    }

    if (updates.authors !== undefined) {
      updatedBook.authors = Array.isArray(updates.authors) ? updates.authors : [updates.authors];
    }

    if (updates.description !== undefined) {
      updatedBook.description = updates.description;
    }

    if (updates.isbn !== undefined) {
      updatedBook.isbn = updates.isbn;
    }

    if (updates.publishedDate !== undefined) {
      updatedBook.publishedDate = updates.publishedDate;
    }

    if (updates.pageCount !== undefined) {
      updatedBook.pageCount = updates.pageCount;
    }

    if (updates.categories !== undefined) {
      updatedBook.categories = updates.categories;
    }

    if (updates.imageLinks !== undefined) {
      updatedBook.imageLinks = updates.imageLinks;
    }

    if (updates.language !== undefined) {
      updatedBook.language = updates.language;
    }

    currentBooks[bookIndex] = updatedBook;

    await dbConn.query("UPDATE library SET books = ? WHERE userId = ?",
      [
        JSON.stringify(currentBooks),
        user.id
      ]
    );

    return NextResponse.json({ status: 200, message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ status: 500, message: `Failed to update book: ${errorMessage}` });
  } finally {
    if (dbConn) {
      dbConn.release();
    }
  }
};