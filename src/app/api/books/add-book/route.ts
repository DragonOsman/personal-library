import connectionPool from "@/src/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { PoolConnection, RowDataPacket } from "mysql2/promise";
import { randomUUID } from "crypto";
import { IBook } from "@/src/app/context/BookContext";

export const POST = async (req: NextRequest) => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ message: "Please log in first" }, { status: 401 });
  }

  let dbConn: PoolConnection | null = null;
  try {
    dbConn = await connectionPool.getConnection();

    // User is assumed to exist due to Clerk webhooks handling user creation.
    const [libraryRows] = await dbConn.execute<RowDataPacket[]>(
      "SELECT books FROM libraries WHERE userId = ?",
      [user.id]
    );
    const libraryEntryExists = libraryRows.length > 0 && libraryRows[0] && libraryRows[0].books !== null;

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
    return NextResponse.json(
      { message: "Missing required fields: title, authors, publishedDate, isbn, description are required." },
      { status: 400 }
    );
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

    return NextResponse.json({ message: "Book added successfully", book: newBook }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/books/add-book:", error);
    let httpStatus = 500; // Default to Internal Server Error
    let message = "An unexpected error occurred while adding the book.";

    interface MySQLError extends Error {
        errno?: number;
        sqlMessage?: string;
        code?: string;
    }

    const dbError = error as MySQLError;

    if (dbError.errno || dbError.code) {
        message = dbError.sqlMessage || dbError.message;
        switch (dbError.errno) {
            case 1452: // ER_NO_REFERENCED_ROW_2 (Foreign Key Constraint)
                httpStatus = 400; // Or 500 if user sync is expected to be perfect
                message = `Data integrity issue: ${dbError.sqlMessage || "Associated user record not found. Please ensure your profile is synced."}`;
                break;
            // Add other specific MySQL error codes as needed
            default:
                httpStatus = 500;
                message = `Database error (${dbError.code || dbError.errno}): ${dbError.sqlMessage || dbError.message}`;
        }
    } else if (error instanceof Error) {
        message = error.message;
    }

    return NextResponse.json({ message }, { status: httpStatus });
  } finally {
    if (dbConn) {
      dbConn.release();
    }
  }
};