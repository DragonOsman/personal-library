import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import connection from "@/src/app/lib/db";
import { RowDataPacket } from "mysql2";

export const DELETE = async (req: NextRequest,
  { params }: { params: Promise<{ id: string }> }) => {
  const user = await currentUser();
  const id = (await params).id;
  const conn = await connection;

  if (user) {
    try {
      const [fields] = await conn.query<RowDataPacket[]>(
        "SELECT books FROM library WHERE user_id = ?",
        [user.id]
      );
      const books = JSON.parse(fields[0].books);
      const bookIndex = books.findIndex((book: { id: string }) => book.id === id);

      if (bookIndex === -1) {
        return NextResponse.json({ status: 404, message: "Book not found" });
      }

      books.splice(bookIndex, 1);
      await conn.query("UPDATE library SET books = ? WHERE user_id = ?",
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