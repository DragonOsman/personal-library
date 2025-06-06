import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "";
  const uriEncodedTitle = encodeURIComponent(title);
  const apiKey = process.env.GOOGLE_API_KEY;

  const url = `https://www.googleapis.com/books/v1/volumes?q=${uriEncodedTitle}&key=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`An error occurred while fetching books: ${error}`);
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}