// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import prisma from "@/lib/db";
import { auth } from "@/auth";
import {
  getGoogleBooksCover,
  normalizeGoogleBooksImageUrl
} from "@/utils/google-books";

export const POST = async (req: NextRequest) => {
  const session = await auth.api.getSession({
    headers: req.headers
  });

  if (!session) {
    return NextResponse.json(
      { message: "Please log in first" },
      { status: 401 }
    );
  }

  const user = session.user;

  if (!user) {
    return NextResponse.json(
      { message: "Please log in first" },
      { status: 401 }
    );
  }

  try {
    const requestBody = await req.json();

    const {
      title,
      authors,
      publishedDate,
      isbn,
      description,
      pageCount,
      categories,
      imageLinks,
      language,
      averageRating,
      ratingsCount
    } = requestBody;

    // Validate required fields.
    if (
      !title ||
      !Array.isArray(authors) ||
      authors.length === 0 ||
      !publishedDate ||
      !isbn ||
      !description
    ) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: title, authors, publishedDate, isbn, description are required."
        },
        { status: 400 }
      );
    }

    /*
     * Try to retrieve the cover from Google Books.
     *
     * This is done regardless of whether the book was added through
     * the Google Books search form or the manual form.
     */
    let normalizedImageLinks:
      | {
          thumbnail?: string;
          smallThumbnail?: string;
        }
      | undefined;

    try {
      const googleBooksCover = await getGoogleBooksCover({
        isbn,
        title,
        author: authors[0]
      });

      if (googleBooksCover) {
        const normalizedCover =
          normalizeGoogleBooksImageUrl(googleBooksCover as string);

        normalizedImageLinks = {
          thumbnail: normalizedCover,
          smallThumbnail: normalizedCover
        };
      }
    } catch (error) {
      console.error(
        `Error retrieving Google Books cover: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    /*
     * If Google Books did not provide a cover, fall back to
     * imageLinks supplied by the client.
     */
    if (!normalizedImageLinks && imageLinks) {
      normalizedImageLinks = {
        thumbnail: imageLinks.thumbnail
          ? normalizeGoogleBooksImageUrl(imageLinks.thumbnail)
          : undefined,
        smallThumbnail: imageLinks.smallThumbnail
          ? normalizeGoogleBooksImageUrl(imageLinks.smallThumbnail)
          : undefined
      };
    }

    const newBook = {
      id: randomUUID(),
      title,
      author: authors[0],
      authors: authors.length > 1 ? authors : [],
      userId: user.id,
      isbn,
      publishedDate,
      description,

      pageCount:
        pageCount !== undefined && pageCount !== null
          ? pageCount
          : undefined,

      categories:
        categories !== undefined &&
        categories !== null &&
        categories !== ""
          ? categories
          : undefined,

      language:
        language !== undefined &&
        language !== null &&
        language !== ""
          ? language
          : undefined,

      imageLinks: normalizedImageLinks,

      averageRating:
        averageRating !== undefined &&
        averageRating !== null
          ? averageRating
          : undefined,

      ratingsCount:
        ratingsCount !== undefined &&
        ratingsCount !== null
          ? ratingsCount
          : undefined
    };

    try {
      await prisma.book.create({
        data: {
          ...newBook
        }
      });
    } catch (transactionError) {
      console.error(
        `Database error while creating book: ${transactionError}`
      );

      return NextResponse.json(
        { message: "Failed to add book" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Book added successfully",
        book: newBook
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      `Error in POST /api/books/add-book: ${error}`
    );

    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred";

    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
};