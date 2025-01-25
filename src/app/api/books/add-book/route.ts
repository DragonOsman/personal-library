import connectionPool from "@/src/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { RowDataPacket } from "mysql2";

export const POST = async (req: NextRequest) => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ status: 401, message: "Please log in first" });
  }

  const { title, author, publicationDate, isbn, synopsis } = await req.json();

  if (!title || !author || !publicationDate || !isbn || !synopsis) {
    return NextResponse.json({ status: 400, message: "Missing required fields" });
  }

  try {
    const [rows] = await connectionPool.query<RowDataPacket[]>(
      "SELECT books FROM library WHERE user_id = ?",
      [user.id]
    );

    let books = [];
    if (rows.length > 0 && rows[0].books) {
      books = JSON.parse(rows[0].books);
    }

    books.push({ title, author, publishedDate: publicationDate, isbn, synopsis });

    await connectionPool.query(
      "UPDATE library SET books = ? WHERE user_id = ?",
      [JSON.stringify(books), user.id]
    );

    return NextResponse.json({ status: 200, message: "Book added successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
};