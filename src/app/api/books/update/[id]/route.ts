import { currentUser } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import pool from "@/src/app/lib/db";
import { PoolClient, QueryResult } from "pg";
import { IBook } from "@/src/app/context/BookContext";

export const PUT = async (req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const bookId = (await params).id;
  const user = await currentUser();
  let dbClient: PoolClient | null = null;

  if (!user) {
    return NextResponse.json({ status: 401, message: "Unauthorized"});
  }

  try {
    dbClient = await pool.connect();
    const result: QueryResult = await dbClient.query(
      "SELECT books FROM libraries WHERE userId = $1",
      [user.id]
    );

    if (result.rows.length === 0 || !result.rows[0].books) {
      return NextResponse.json({ status: 404, message: "Library not found" });
    }

    const currentBooks: IBook[] = result.rows[0].books;
    const bookIndex = currentBooks.findIndex(book => book.id === bookId);

    if (bookIndex === -1) {
      return NextResponse.json({ status: 404, message: "Book not found" });
    }

    const updates = await req.json();

    const updatedBook: IBook = {
      ...currentBooks[bookIndex],
      ...updates
    };

    currentBooks[bookIndex] = updatedBook;

    await dbClient.query("UPDATE libraries SET books = $1 WHERE userId = $2",
      [JSON.stringify(currentBooks), user.id]
    );

    return NextResponse.json({ status: 200, message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ status: 500, message: `Failed to update book: ${errorMessage}` });
  } finally {
    if (dbClient) {
      dbClient.release();
    }
  }
};