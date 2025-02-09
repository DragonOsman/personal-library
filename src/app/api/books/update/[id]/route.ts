import { currentUser } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import connection from "@/src/app/lib/db";
import { RowDataPacket } from "mysql2";

export const PUT = async (req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const bookId = (await params).id;

  const user = await currentUser();
  if (user) {
    const conn = await connection;
    const [rows] = await conn.query<RowDataPacket[]>(
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
      const [rows] = await conn.query<RowDataPacket[]>(query, values);

      NextResponse.json({ status: 200, rows });
    }
  }
};