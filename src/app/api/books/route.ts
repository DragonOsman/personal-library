import connectionPool from "@/src/app/lib/db";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import type { RowDataPacket, PoolConnection } from "mysql2/promise";
import { IBook } from "@/src/app/context/BookContext";

export const GET = async () => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ message: "Please log in first" }, { status: 401 });
  }
  const readerId: string = user.id;
  console.log(`Line 12 in src/app/api/books/route.ts: readerId: ${readerId}`);
  let dbConn: PoolConnection | null = null;
  try {
    dbConn = await connectionPool.getConnection();
    const [rows] = await dbConn.query<RowDataPacket[]>(
      `SELECT books FROM libraries WHERE userId = ?`,
      [readerId]
    );

    if (rows.length === 0 || !rows[0] || typeof rows[0].books === "undefined" || rows[0].books === null) {
      // No library entry found, or books column is null/undefined
      console.log(`Line 23 in src/app/api/books/route.ts: rows.length: ${rows.length}, books: ${rows[0]?.books}`);
      return NextResponse.json({ books: [] }, { status: 404 });
    }

    let userBooks: IBook[] = [];

    if (typeof rows[0].books === "string") {
      try {
        userBooks = JSON.parse(rows[0].books);
        if (!Array.isArray(userBooks)) {
          console.warn(`Parsed books data for user ${user.fullName} is not an array. Found:`, userBooks);
          userBooks = [];
        }
      } catch (parseError) {
        console.error(`Error parsing books JSON for user ${user.fullName}: ${parseError}. Data:`, rows[0].books);
        return NextResponse.json({ message: "Error processing library data" }, { status: 500 });
      }
    } else if (Array.isArray(rows[0].books)) {
      userBooks = rows[0].books;
    } else {
      console.warn(`Unexpected type for books data for user ${user.fullName}:`, typeof rows[0].books);
      userBooks = [];
    }

    return NextResponse.json({ books: userBooks }, { status: 200});
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error fetching books for user ${user.fullName}: ${errorMessage}`, error);
    return NextResponse.json({ message: "Failed to retrieve books from library" }, { status: 500 });
  } finally {
    if (dbConn) {
      dbConn.release();
    }
  }
};
