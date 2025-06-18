import pool from "@/src/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { PoolClient, QueryResult } from "pg";
import { randomUUID } from "crypto";
import { IBook } from "@/src/app/context/BookContext";

interface GoogleApiVolumeInfo {
  title: string;
  authors?: string[];
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: Array<{ type: string; identifier: string }>;
  pageCount?: number;
  categories?: string[];
  imageLinks?: {
    thumbnail: string;
    smallThumbnail?: string;
  };
  language?: string;
}

interface GoogleApiBookItem {
  id?: string;
  volumeInfo: GoogleApiVolumeInfo;
}

export const POST = async (req: NextRequest) => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ message: "Please log in first" }, { status: 401 });
  }

  let dbClient: PoolClient | null = null;
  try {
    dbClient = await pool.connect();

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

    const libraryResult: QueryResult = await dbClient.query(
      "SELECT books FROM libraries WHERE userId = $1",
      [user.id]
    );

    let currentBooks: IBook[] = [];
    if (libraryResult.rows.length > 0 && libraryResult.rows[0].books) {
      currentBooks = libraryResult.rows[0].books;
    }
    currentBooks.push(newBook);

    await dbClient.query(`
      INSERT INTO libraries (userId, books)
      VALUES ($1, $2)
      ON CONFLICT (userId) DO UPDATE
      SET books = $2
    `, [user.id, currentBooks]);

    return NextResponse.json({ message: "Book added successfully", book: newBook }, { status: 200 });
  } catch (error) {
    console.error(`Error in POST /api/books/add-book:${error}`);
    const errorMessage = error instanceof Error ?
      error.message :
      "An unexpected error occurred"
    ;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  } finally {
    if (dbClient) {
      dbClient.release();
    }
  }
};