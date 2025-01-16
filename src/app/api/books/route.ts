import connectionPool from "@/src/app/lib/db";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export const GET = async () => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ status: 401, message: "Please log in first" });
  }
  const readerId: string = user.id;
  const conn = await connectionPool.getConnection();
  const [rows] = await conn.connection.query(`SELECT * FROM books WHERE JSON_CONTAINS(reader_ids, '"${readerId}"')`);
  return NextResponse.json({ status: 200, success: true, rows });
};