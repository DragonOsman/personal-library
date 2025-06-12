/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { BookContext, IBookContext, IBook } from "../../context/BookContext";
import { useContext, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

declare global {
  interface Window {
    google: any;
  }
}

const ListBooksPage = () => {
  const { books, setBooks } = useContext<IBookContext>(BookContext);
  const baseURL = `${process.env.NODE_ENV === "production" ?
    `${process.env.NEXT_PUBLIC_BASE_URLPROD}` :
    `${process.env.NEXT_PUBLIC_BASE_URLDEV}`}`
  ;

  const handleDelete = async (id: string) => {
    const response = await fetch(`${baseURL}/api/books/delete/:${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
    if (response.ok) {
      console.log("Book deleted successfully");
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksResponse = await fetch(`${baseURL}/api/books/`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const booksData = await booksResponse.json();
        if (booksResponse.ok) {
          try {
            if (booksData && Array.isArray(booksData.books)) {
              setBooks(booksData.books);
            } else {
              console.warn("Fetched books data is not in the expected format:", booksData);
              setBooks([]);
            }
          } catch (err) {
            console.log(`An error occurred while extracting json data from response: ${err}`);
          }
        } else if (booksResponse.status === 404) {
          if (booksData && Array.isArray(booksData.books)) {
            setBooks(booksData.books);
          } else {
            setBooks([])
          }
        } else {
          console.error(`Error fetching books: ${booksResponse.status}: ${booksResponse.statusText}`, booksData);
        }
      } catch (err) {
        console.error(`An error occurred when getting book list or parsing JSON: ${err}`);
        setBooks([]);
      }
    };

    fetchBooks();
  }, [baseURL, setBooks]);

  const dataArray = useMemo(() => {
    const arr: Record<string, any>[] = [];
    return arr;
  }, []);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        for (const book of books) {
          const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn=${book.isbn}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          });

          if (response.ok) {
            try {
              const data = await response.json();
              dataArray.push(data);
            } catch (err) {
              console.log(`An error occurred when getting json data from response: ${err}`);
            }
          }
        }
      } catch (err) {
        console.log(`An error occurred when getting book data: ${err}`);
      }
    };

    fetchBookData();
  }, [books, dataArray]);

  return (
    <div className="list-books flex justify-items-center items-center flex-col">
      {dataArray.length > 0 && books.length > 0 ? (
        dataArray.map((data: Record<string, any>, index: number) => (
          books.map((book) => (
            <div key={book.id} className="book">
              <p>{book.title}</p>
              <Image
                src={data.items[index].volumeInfo.imageLinks.thumbnail}
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
                href={`${baseURL}/books/update-book/:${book.id!}`}
                className="p-5 color"
              >
                Edit Book
              </Link>
            </div>
          ))
        ))
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