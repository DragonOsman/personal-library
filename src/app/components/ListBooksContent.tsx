// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { BookContext, IBookContext } from "@/app/context/BookContext";
import DeleteBook from "@/app/components/DeleteBook";
import { useContext } from "react";
import NextImage from "next/image";
import Link from "next/link";

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
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => {
            const imageLinks = book.imageLinks as {
              thumbnail?: string;
              smallThumbnail?: string;
            } | null;

            const imgUrl = imageLinks?.thumbnail || imageLinks?.smallThumbnail;
            console.log(`Image URL for book "${book.title}": ${imgUrl}`);

            return (
              <div key={book.id} className="card bg-base-100 shadow-md hover:shadow-lg transition">
                <figure className="px-4 pt-4">
                  <NextImage
                    src={imgUrl || "/images/book-composition-with-open-book_23-2147690555.jpg"}
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