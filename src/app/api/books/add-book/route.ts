import pool from "@/src/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { IBook } from "@/src/app/context/BookContext";
import { PoolClient } from "pg"

export const POST = async (req: NextRequest) => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ message: "Please log in first" }, { status: 401 });
  }

  try {
    const requestBody = await req.json();
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
  } = requestBody;

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



    let dbClient: PoolClient | null = null;
    try {
      dbClient = await pool.connect();
      await dbClient.query("BEGIN");

      const libraryResult = await dbClient.query(`
        SELECT books FROM libraries WHERE userId = $1
        `,
        [user.id]
      );
      const currentBooks: IBook[] = (libraryResult.rows[0]?.books as IBook[]) || [];
      const updatedBooks = [...currentBooks, newBook];
      if (libraryResult.rows.length > 0) {
        await dbClient.query(`
          UPDATE libraries SET books = $1 WHERE userId =  $2
          `,
          [JSON.stringify(updatedBooks), user.id]
        );
      } else {
        await dbClient.query(`
          INSERT INTO libraries (userId, books) VALUES ($1, $2)
          `,
          [user.id, JSON.stringify([newBook])]
        );
      }

      await dbClient.query("COMMIT");
    } catch (transactionError) {
      if (dbClient) {
        await dbClient.query("ROLLBACK");
        throw transactionError;
      }
    } finally {
      if (dbClient) {
        dbClient.release();
      }
    }

    return NextResponse.json({ message: "Book added successfully", book: newBook }, { status: 200 });
  } catch (error) {
    console.error(`Error in POST /api/books/add-book: ${error}`);
    const errorMessage = error instanceof Error ?
      error.message :
      "An unexpected error occurred"
    ;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
};