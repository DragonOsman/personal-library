// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { BookContext, IBookContext } from "@/app/context/BookContext";
import DeleteBook from "@/app/components/DeleteBook";
import type { IBook } from "@/app/context/BookContext";
import { useContext, useEffect, useState } from "react";
import NextImage from "next/image";
import bookImgFallback from "@/public/images/book-composition-with-open-book_23-2147690555.jpg";
import Link from "next/link";
import BookSkeleton from "@/app/components/ui/BookSkeleton";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
        };
      };
    } | undefined;
  }
}

const ListBooksContent = () => {
  const { books } = useContext<IBookContext>(BookContext);
  const [bookData, setBookData] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const bookResultPromises: Promise<IBook>[] = books.map(async (book: IBook): Promise<IBook> => {
          return fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn=${book.isbn}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          }).then(response => response.json()).catch((error: Error) => (
            console.error(`Error fetching book data for ISBN ${book.isbn}: ${error.message}`)
          ));
        });

        const bookResults = await Promise.all(bookResultPromises);
        setBookData(bookResults);
      } catch (error) {
        console.error(`Error fetching book data: ${error}`);
      }
    };

    fetchBookData();
  }, [books]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">My Library</h1>
        <p className="text-gray-500">Manage your books</p>
      </div>

      {/* Content */}
      {books.length === 0 ? (
        <div className="text-center space-y-4">
          <p className="text-gray-500 text-lg">No books yet 📚</p>
          <Link href="/books/add-book" className="btn btn-primary">
            Add your first book
          </Link>
        </div>
      ) : bookData.length === 0 ? (
        <BookSkeleton />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book, index) => {
            const currentBookData = bookData[index];
            const imgUrl =
              currentBookData?.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;

            return (
              <div key={book.id} className="card bg-base-100 shadow-md hover:shadow-lg transition">
                <figure className="px-4 pt-4">
                  <NextImage
                    src={imgUrl || bookImgFallback}
                    alt={book.title}
                    width={128}
                    height={192}
                    className="rounded"
                  />
                </figure>

                <div className="card-body items-center text-center">
                  <h2 className="card-title line-clamp-2">{book.title}</h2>

                  <div className="card-actions">
                    <Link href={`/books/update-book/${book.id}`} className="btn btn-sm btn-primary">
                      Edit
                    </Link>
                    <DeleteBook id={book.id} />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    )}
    </div>
  );
};

export default ListBooksContent;