/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { BookContext, IBookContext } from "../../context/BookContext";
import type { IBook } from "../../context/BookContext";
import { useContext, useEffect, useState, useCallback } from "react";
import NextImage from "next/image";
import bookImgFallback from "../../../../public/images/book-composition-with-open-book_23-2147690555.jpg";
import Link from "next/link";

declare global {
  interface Window {
    google: any;
  }
}

const ListBooksPage = () => {
  const { books, setBooks } = useContext<IBookContext>(BookContext);
  const [bookData, setBookData] = useState<Record<string, any>[]>([]);
  const baseURL = `${process.env.NODE_ENV === "production" ?
    `${process.env.NEXT_PUBLIC_BASE_URLPROD}` :
    `${process.env.NEXT_PUBLIC_BASE_URLDEV}`}`
  ;

  const handleDelete = useCallback(async (id: string) => {
    const response = await fetch(`${baseURL}/api/books/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
    if (response.ok) {
      setBooks(books.filter((book: IBook) => book.id !== id));
    }
  }, [baseURL, books, setBooks]);


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
    <div className="list-books flex justify-items-center items-center flex-col">
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
              <button
                type="button"
                onClick={() => handleDelete(book.id!)}
              >
                Delete
              </button>
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
  );
};

export default ListBooksPage;