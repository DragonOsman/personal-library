import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import connectionPool from "@/src/app/lib/db";
import { RowDataPacket } from "mysql2";

export const DELETE = async (req: NextRequest) => {
  const connection = await connectionPool.getConnection();
  const user = await currentUser();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (user) {
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        "SELECT books FROM library WHERE user_id = ?",
        [user.id]
      );
      const books = JSON.parse(rows[0].books);
      const bookIndex = books.findIndex((book: { id: number }) => book.id === Number(id));

      if (bookIndex === -1) {
        return NextResponse.json({ status: 404, message: "Book not found" });
      }

      books.splice(bookIndex, 1);
      await connection.query("UPDATE library SET books = ? WHERE user_id = ?",
        [JSON.stringify(books), user.id]);

      return NextResponse.json({ status: 200, message: "Book deleted successfully" });
    } catch (err) {
      return NextResponse.json({
        status: 501,
        message: `An unexpected error occurred: ${(err as Error).message}` }
      );
    }
  }
};