import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { IBook } from "@/src/app/context/BookContext";
import prisma from "@/src/app/lib/db";
import { auth } from "@/src/auth";

export const POST = async (req: NextRequest) => {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Please log in first" }, { status: 401 });
  }

  const user = session.user;
  if (!user) {
    return NextResponse.json({ message: "Please log in first" }, { status: 401 });
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

    // Validate truly required fields. Description is also required by the frontend form's Zod schema.
    if (!title || !authors || !Array.isArray(authors) || authors.length === 0 || !publishedDate || !isbn || !description) {
      return NextResponse.json(
        { message: "Missing required fields: title, authors, publishedDate, isbn, description are required." },
        { status: 400 }
      );
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
      pageCount: (pageCount !== undefined || pageCount !== null) ? pageCount : undefined,
      categories: (categories !== "" || categories !== undefined || categories !== null) ? categories : undefined,
      language: (language !== "" || language !== undefined || language !== null) ? language : undefined,
      imageLinks: (imageLinks !== undefined || imageLinks !== null) ? imageLinks : undefined,
      averageRating: (averageRating !== undefined || averageRating !== null) ? averageRating : undefined,
      ratingsCount: (ratingsCount !== undefined || ratingsCount !== null) ? ratingsCount : undefined
    };

    try {
      await prisma.book.create({
        data: {
          ...newBook
        }
      });
    } catch (transactionError) {
      console.error(`Database error while creating book: ${transactionError}`);
      return NextResponse.json({ message: "Failed to add book" }, { status: 500 });
    }

    return NextResponse.json({ message: "Book added successfully", book: newBook }, { status: 200 });
  } catch (error) {
    console.error(`Error in POST /api/books/add-book: ${error}`);
    const errorMessage = error instanceof Error ?
      error.message :
      "An unexpected error occurred"
    ;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
};