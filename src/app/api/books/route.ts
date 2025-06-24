import pool from "@/src/app/lib/db";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { IBook } from "@/src/app/context/BookContext";
import { PoolClient } from "pg";

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
    const result = await pool.query(`
        SELECT books FROM libraries WHERE userId = $1
      `,
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

    const userBooks: IBook[] = result.rows[0].books || [];

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
