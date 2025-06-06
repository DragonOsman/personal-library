import connection from "@/src/app/lib/db";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import type { RowDataPacket } from "mysql2";

export const GET = async () => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ status: 401, message: "Please log in first" });
  }
  const readerId: string = user.id;
  let bookRows: RowDataPacket[] = [];
  try {
    const conn = await connection;
    await conn.connect();
    // First, get the user's library id
    const [libraryRows]: RowDataPacket[] = await conn.query(
      `SELECT * FROM library WHERE userId = ?`,
      [readerId]
    ) as RowDataPacket[];
    if (!libraryRows.length) {
      bookRows = [];
    } else {
      // Now, get books that are in the user's library
      const [rows] = await conn.query<RowDataPacket[]>(
        `SELECT books FROM library WHERE userId = ?`,
        [readerId]
      );
      bookRows = rows;
    }
  } catch (err) {
    console.error(`An error occurred while trying to either connect to database or retrieve data: ${err}`);
  }
  return NextResponse.json({ status: 200, success: true, rows: bookRows });
};

