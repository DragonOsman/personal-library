import connection from "../../lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  const [rows] = await connection.query("SELECT * FROM books");
  return NextResponse.json({ status: 200, success: true, rows });
};