import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import connectionPool from "@/src/app/lib/db";
import { PoolConnection, RowDataPacket } from "mysql2/promise";

export const DELETE = async (req: NextRequest,
  { params }: { params: Promise<{ id: string }> }) => {
  const user = await currentUser();
  const id = (await params).id;
  const dbConn: PoolConnection = await connectionPool.getConnection();

  if (user) {
    try {
      const [rows] = await dbConn.query<RowDataPacket[]>(
        "SELECT books FROM library WHERE userId = ?",
        [user.id]
      );
      const books = JSON.parse((rows as RowDataPacket[])[0].books);
      const bookIndex = books.findIndex((book: { id: string }) => book.id === id);

      if (bookIndex === -1) {
        return NextResponse.json({ status: 404, message: "Book not found" });
      }

      books.splice(bookIndex, 1);
      await dbConn!.query("UPDATE library SET books = ? WHERE userId = ?",
        [JSON.stringify(books), user.id]);
      return NextResponse.json({ status: 200, message: "Book deleted successfully" });
    } catch (err) {
      return NextResponse.json({
        status: 501,
        message: `An unexpected error occurred: ${(err as Error).message}` }
      );
    } finally {
      if (dbConn) dbConn.release();
    }
  }
};
;