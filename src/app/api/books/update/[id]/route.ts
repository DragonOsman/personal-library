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

    const { title, author, isbn, synopsis, publicationDate, genre } = await req.json();

    if (rows.length !== 0) {
      const query = `
        UPDATE library
        SET books = JSON_REPLACE(
          books,
          '$.books[?(@.id == ?)].title', ?,
          '$.books[?(@.id == ?)].author', ?,
          '$.books[?(@.id == ?)].isbn', ?,
          '$.books[?(@.id == ?)].synopsis', ?,
          '$.books[?(@.id == ?)].publicationDate', ?
        )
      `;
      const values = [
        bookId, bookId, title,
        bookId, bookId, author,
        bookId, bookId, isbn,
        bookId, bookId, synopsis,
        bookId, bookId, publicationDate,
        bookId, bookId, genre
      ];
      const [rows] = await conn.query<RowDataPacket[]>(query, values);

      NextResponse.json({ status: 200, rows });
    }
  }
};