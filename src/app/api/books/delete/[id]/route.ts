import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/src/app/lib/db";
import { PoolClient, QueryResult } from "pg";
import { IBook } from "@/src/app/context/BookContext";

export const DELETE = async (req: NextRequest,
  { params }: { params: Promise<{ id: string }> }) => {
  const user = await currentUser();
  const bookId = (await params).id;
  let dbClient: PoolClient | null= null;

  if (user) {
    try {
      dbClient = await pool.connect();
      const result: QueryResult = await dbClient.query(
        "SELECT books FROM libraries WHERE userId = $1",
        [user.id]
      );

      if (result.rows.length === 0 || !result.rows[0].books) {
        return NextResponse.json({ status: 404, message: "Library not found for user" });
      }
      const books: Array<IBook> = result.rows[0].books;
      const bookIndex = books.findIndex((book: IBook) => book.id === bookId);

      if (bookIndex === -1) {
        return NextResponse.json({ status: 404, message: "Book not found" });
      }

      books.splice(bookIndex, 1);
      await dbClient.query("UPDATE libraries SET books = $1 WHERE userId = $2",
        [books, user.id]
      );
      return NextResponse.json({ status: 200, message: "Book deleted successfully" });
    } catch (err) {
      return NextResponse.json({
        status: 500,
        message: `An unexpected error occurred: ${(err as Error).message}` }
      );
    } finally {
      if (dbClient) {
        dbClient.release();
      }
    }
  }
};
