import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import connectionPool from "@/src/app/lib/db";

export const DELETE = async (req: NextRequest) => {
  const connection = await connectionPool.getConnection();
  const user = await currentUser();
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("book_id");

  if (user) {
    try {
      await connection.connection.query("DELETE FROM books WHERE id = ? AND JSON_ARRAY_CONTAINS(reader_ids, ?, $",
        [bookId, user.id]
      );
      return NextResponse.json({ status: 200, message: "Book deleted successfully" });
    } catch (err) {
      return NextResponse.json({
        status: 501,
        message: `An unexpected error occurred: ${(err as Error).message}` }
      );
    }
  }
};