import { currentUser } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import connectionPool from "@/src/app/lib/db";
import { RowDataPacket } from "mysql2";

export const PUT = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("book_id");

  const user = await currentUser();
  if (user) {
    const connection = await connectionPool.getConnection();
    const [rows] = await connection.connection.query<RowDataPacket[]>(
      "SELECT * FROM books WHERE id = ? AND JSON_CONTAINS(reader_ids, ?, $)",
      [bookId, user.id]
    );

    const { title, author, isbn, synopsis, publication_date } = await req.json();

    if (rows.length !== 0) {
      const [rows] = await connection.connection.query<RowDataPacket[]>(
        "UPDATE books SET title = ?, synopsis = ?, JSON_ARRAY_APPEND(reader_ids, $, ?), isbn = ?, author = ?, publication_date = ?",
        [title, synopsis, user.id, isbn, author, publication_date]
      );

      NextResponse.json({ status: 200, rows });
    }
  }
};