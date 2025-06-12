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

  let dbConn: PoolConnection | null= null;
  try {
    dbConn = await connectionPool.getConnection();
    const [rows] = await dbConn.execute<RowDataPacket[]>(
      "SELECT books FROM libraries WHERE userId = ?",
      [user.id]
    );
    const libraryEntryExists = rows.length > 0 && rows[0] && rows[0].books !== null;

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

    const newBookJson = JSON.stringify(newBook);

    if (libraryEntryExists) {
      await dbConn.execute(
        "UPDATE libraries SET books = JSON_ARRAY_APPEND(COALESCE(books, JSON_ARRAY()), '$', CAST(? AS JSON)) WHERE userId = ?",
        [newBookJson, user.id]
      );
    } else {
      await dbConn.execute(
        "INSERT INTO libraries (userId, books) VALUES (?, JSON_ARRAY(CAST(? AS JSON)))",
        [user.id, newBookJson]
      );
    }

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