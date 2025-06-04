import connection from "@/src/app/lib/db";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export const GET = async () => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ status: 401, message: "Please log in first" });
  }
  const readerId: string = user.id;
  let rows;
  try {
    const conn = await connection;
    await conn.connect();
    [rows] = await conn.query(
      `SELECT * FROM books WHERE JSON_CONTAINS(reader_ids, '"${readerId}"')`
    );
  } catch (err) {
    console.error(`An error occurred while trying to either connect to database or retrieve data: ${err}`)
  }
  return NextResponse.json({ status: 200, success: true, rows });
};