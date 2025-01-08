import connection from "../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { title, synopsis, author, isbn, publication_date } = await req.json();
  const [result] = await connection.query(`INSERT INTO books (title, synopsis,
    author, isbn, publication_date) VALUES (${title}, ${synopsis}, ${author},
    ${isbn}, ${publication_date})`
  );
  return NextResponse.json({status: 201, sucess: true, result});
};