import connectionPool from "@/src/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { RowDataPacket } from "mysql2";

export const POST = async (req: NextRequest) => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ status: 401, message: "Please log in first" });
  }

  // Check if book is already in database
  let rows: RowDataPacket[] = [];
  const { title, synopsis, author, isbn, publication_date, readerIds } = await req.json();
  const conn = await connectionPool.getConnection();
  try {
    [rows] = await conn.connection.query<RowDataPacket[]>("SELECT FROM books (title, isbn) WHERE title = ? AND isbn = ?",
      [title, isbn]
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      status: 501,
      message: `An unexpected error occurred: ${(err as Error).message}` }
    );
  }

  // If it isn't, insert it
  if (rows.length === 0) {
    const [result] = await connectionPool.query("INSERT INTO books (title, synopsis, author, isbn, publication_date, reader_ids) VALUES (?, ?, ?, ?, ?, ?)",
      [title, synopsis, author, isbn, publication_date, readerIds]
    );
    return NextResponse.json({status: 201, success: true, result});
  } else {
    // Otherwise, redirect user to update route to edit the database
    // entry and insert their ID into the reader_ids array
    redirect("/api/books/update");
  }
};