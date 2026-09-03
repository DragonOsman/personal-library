// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

import { NextRequest, NextResponse } from "next/server";

const GOOGLE_BOOKS_API_URL =
  "https://www.googleapis.com/books/v1/volumes";

const DEFAULT_MAX_RESULTS = 40;
const MAX_MAX_RESULTS = 40;

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.error("Google API key is missing");

    return NextResponse.json(
      { message: "API key is missing" },
      { status: 500 }
    );
  }

  const title = searchParams.get("title");
  const author = searchParams.get("author");
  const isbn = searchParams.get("isbn");
  const subject = searchParams.get("subject");

  const startIndexParam = searchParams.get("startIndex");
  const maxResultsParam = searchParams.get("maxResults");

  const parsedStartIndex = Number.parseInt(
    startIndexParam ?? "0",
    10
  );

  const startIndex =
    Number.isFinite(parsedStartIndex) && parsedStartIndex >= 0
      ? parsedStartIndex
      : 0;

  const parsedMaxResults = Number.parseInt(
    maxResultsParam ?? DEFAULT_MAX_RESULTS.toString(),
    10
  );

  const maxResults =
    Number.isFinite(parsedMaxResults) && parsedMaxResults > 0
      ? Math.min(parsedMaxResults, MAX_MAX_RESULTS)
      : DEFAULT_MAX_RESULTS;

  console.log("Incoming book search parameters:", {
    title,
    author,
    isbn,
    subject,
    startIndex,
    maxResults
  });

  const queryParts: string[] = [];

  if (title) {
    queryParts.push(`intitle:"${title}"`);
  }

  if (author) {
    queryParts.push(`inauthor:"${author}"`);
  }

  if (isbn) {
    queryParts.push(`isbn:${isbn}`);
  }

  if (subject) {
    queryParts.push(`subject:"${subject}"`);
  }

  if (queryParts.length === 0) {
    return NextResponse.json(
      {
        message:
          "At least one of title, author, isbn, or subject is required"
      },
      { status: 400 }
    );
  }

  const query = queryParts.join(" ");

  console.log(`Constructed Google Books API query: ${query}`);

  const googleUrl = new URL(GOOGLE_BOOKS_API_URL);

  googleUrl.searchParams.set("q", query);
  googleUrl.searchParams.set("key", apiKey);
  googleUrl.searchParams.set(
    "startIndex",
    startIndex.toString()
  );
  googleUrl.searchParams.set(
    "maxResults",
    maxResults.toString()
  );

  console.log(
    `Google Books API URL: ${googleUrl.toString()}`
  );

  try {
    const response = await fetch(googleUrl);

    console.log(
      "Google Books response:",
      response.status,
      response.statusText
    );

    if (!response.ok) {
      const errorMessage = await response.text();

      console.error(
        `Google Books API request failed: ${response.status} ${errorMessage}`
      );

      return NextResponse.json(
        {
          message: "Google Books API request failed"
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    const items = (data.items ?? []).map(
      (item: typeof data.items[number]) => {
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
              smallThumbnail:
                imageLinks.smallThumbnail?.replace(
                  /^http:\/\//i,
                  "https://"
                ),
              thumbnail:
                imageLinks.thumbnail?.replace(
                  /^http:\/\//i,
                  "https://"
                )
            }
          }
        };
      }
    );

    const totalItems =
      typeof data.totalItems === "number"
        ? data.totalItems
        : 0;

    const endIndex =
      items.length > 0
        ? startIndex + items.length - 1
        : null;

    const hasMore =
      startIndex + items.length < totalItems;

    return NextResponse.json({
      ...data,
      items,
      totalItems,
      startIndex,
      endIndex,
      maxResults,
      hasMore
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : String(error);

    console.error(
      `An error occurred while fetching books: ${errorMessage}`,
      error
    );

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}