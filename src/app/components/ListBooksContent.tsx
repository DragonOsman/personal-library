/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { BookContext, IBookContext } from "@/src/app/context/BookContext";
import DeleteBook from "@/src/app/components/DeleteBook";
import type { IBook } from "@/src/app/context/BookContext";
import { useContext, useEffect, useState } from "react";
import NextImage from "next/image";
import bookImgFallback from "@/public/images/book-composition-with-open-book_23-2147690555.jpg";
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
    <div className="list-books flex justify-center">
      <div className="w-full max-w-md bg-white px-6 py-12 rounded-xl shadow-sm">
        {bookData.length > 0 && books.length > 0 ? (
          books.map((book, index) => {
            const currentBookData = bookData[index];
            const imgUrl = currentBookData?.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
            return (
              <div key={book.id} className="book">
                <p>{book.title}</p>
                <NextImage
                  src={imgUrl || bookImgFallback}
                  alt={book.title}
                  width={128}
                  height={192}
                />
                <DeleteBook id={book.id} />
                <Link
                  href={`/books/update-book/${book.id!}`}
                  className="p-5 color"
                >
                  Edit Book
                </Link>
              </div>
            );
          })
        ) : (
          <>
            <p>No book data available.</p>
            <p>
              Click <Link className="text" href="/books/add-book">here</Link> to search for and add books to your library
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ListBooksContent;