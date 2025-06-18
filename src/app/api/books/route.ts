import pool from "@/src/app/lib/db";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import type { PoolClient, QueryResult } from "pg";
import { IBook } from "@/src/app/context/BookContext";

export const GET = async () => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ message: "Please log in first" }, { status: 401 });
  }
  const userId: string = user.id;
  console.log(`Line 12 in src/app/api/books/route.ts: readerId: ${userId}`);
  let dbClient: PoolClient | null = null;
  try {
    dbClient = await pool.connect();
    const result: QueryResult = await dbClient.query(
      `SELECT books FROM libraries WHERE userId = $1`,
      [userId]
    );

    if (result.rows.length === 0 || !result.rows[0] ||
        typeof result.rows[0].books === "undefined" ||
        result.rows[0].books === null) {
      // No library entry found, or books column is null/undefined
      console.log(
        `Line 23 in src/app/api/books/route.ts: No books found for user ${user.fullName}, ID: ${userId}`
      );
      return NextResponse.json({ books: [] }, { status: 200 });
    }

    let userBooks: IBook[] = [];

    if (typeof result.rows[0].books === "string") {
      try {
        userBooks = JSON.parse(result.rows[0].books);
        if (!Array.isArray(userBooks)) {
          console.warn(`Parsed books data for user ${user.fullName} is not an array. Found:`, userBooks);
          userBooks = [];
        }
      } catch (parseError) {
        console.error(`Error parsing books JSON for user ${user.fullName}: ${parseError}.
          Data:`, result.rows[0].books
        );
        return NextResponse.json({ message: "Error processing library data" }, { status: 500 });
      }
    } else {
      console.warn(`Unexpected type for books data for user ${user.fullName}: ${typeof result.rows[0].books}.`);
      userBooks = [];
    }

    return NextResponse.json({ books: userBooks }, { status: 200});
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error fetching books for user ${user.fullName} (ID: ${userId}): ${errorMessage}`, error);
    return NextResponse.json({ message: "Failed to retrieve books from library" }, { status: 500 });
  } finally {
    if (dbClient) {
      dbClient.release();
    }
  }
};
