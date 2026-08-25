// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "";
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.error("Google API key is missing");
    return NextResponse.json({ message: "API key is missing" }, { status: 500 });
  }

  if (!title) {
    return NextResponse.json({ message: "Title query parameter is required" }, { status: 400 });
  }

  const uriEncodedTitle = encodeURIComponent(title);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${uriEncodedTitle}&key=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Failed to fetch books: ${errorMessage}`);
      return NextResponse.json({ message: errorMessage }, { status: response.status });
    }

    const data = await response.json();

    const items = (data.items || []).map((item: typeof data.items[0]) => {
      const imageLinks = item.volumeInfo?.imageLinks;
      if (!imageLinks) {
        return item;
      }

      return {
        ...item,
        volumeInfo: {
          ...item.volumeInfo,
          imageLinks: {
            ...imageLinks,
            smallThumbnail: imageLinks.smallThumbnail?.replace(/^http:\/\//i, "https://"),
            thumbnail: imageLinks.thumbnail?.replace(/^http:\/\//i, "https://")
          }
        }
      };
    });

    return NextResponse.json({ ...data, items });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`An error occurred while fetching books: ${errorMessage}`, error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};