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
      "SELECT * FROM library WHERE user_id = ?",
      [user.id]
    );

    const { title, author, isbn, synopsis, publication_date } = await req.json();

    if (rows.length !== 0) {
      const query = `
        UPDATE library
        SET books = JSON_REPLACE(
          books,
          '$.books[?(@.id == ?)].title', ?,
          '$.books[?(@.id == ?)].author', ?,
          '$.books[?(@.id == ?)].isbn', ?,
          '$.books[?(@.id == ?)].synopsis', ?,
          '$.books[?(@.id == ?)].publication_date', ?
        )
      `;
      const values = [
        bookId, bookId, title,
        bookId, bookId, author,
        bookId, bookId, isbn,
        bookId, bookId, synopsis,
        bookId, bookId, publication_date
      ];
      const [rows] = await connection.connection.query<RowDataPacket[]>(query, values);

      NextResponse.json({ status: 200, rows });
    }
  }
};