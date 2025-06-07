import connectionPool from "@/src/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { PoolConnection, RowDataPacket } from "mysql2/promise";
import { randomUUID } from "crypto";
import { IBook } from "@/src/app/context/BookContext";

export const POST = async (req: NextRequest) => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ status: 401, message: "Please log in first" });
  }

  const {
    title,
    authors,
    publishedDate,
    isbn,
    description,
    pageCount,
    categories,
    imageLinks,
    language
  } = await req.json();

  // Validate truly required fields. Description is also required by the frontend form's Zod schema.
  if (!title || !authors || !Array.isArray(authors) || authors.length === 0 || !publishedDate || !isbn || !description) {
    return NextResponse.json({ status: 400, message: "Missing required fields: title, authors, publishedDate, isbn, description are required." });
  }
  const dbConn: PoolConnection = await connectionPool.getConnection();
  try {
    const [rows] = await dbConn.execute<RowDataPacket[]>(
      "SELECT books FROM library WHERE userId = ?",
      [user.id]
    );

    let currentBooks: IBook[] = [];
    if (rows.length > 0 && rows[0].books) {
      currentBooks = JSON.parse(rows[0].books as string)
    }

    const newBook: IBook = {
      id: randomUUID(),
      title,
      authors: Array.isArray(authors) ? authors : [authors],
      publishedDate,
      isbn,
      description,
      pageCount,
      categories,
      imageLinks,
      language
    };

    currentBooks.push(newBook);

    await dbConn.execute(
      "INSERT INTO library (userId, books) VALUES (?, ?) ON DUPLICATE KEY UPDATE books = ?",
      [user.id, JSON.stringify(currentBooks), JSON.stringify(currentBooks)]
    );

    return NextResponse.json({ status: 200, message: "Book added successfully", book: newBook });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  } finally {
    if (dbConn) {
      dbConn.release();
    }
  }
};