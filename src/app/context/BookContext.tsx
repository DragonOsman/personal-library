"use client";

import { createContext, ReactNode, useState, useEffect } from "react";
import { mapPrismaBookToIBook } from "../lib/book-mapping";

export interface IBook {
  id: string;
  title: string;
  author: string;
  authors: string[];
  publisher?: string;
  publishedDate: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  userId: string;
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
  }
  language?: string;
  updatedAt?: Date | null | undefined;
  createdAt?: Date | null | undefined;
  isbn?: string | null | undefined;
}

export interface IBookContext {
  books: IBook[];
  setBooks: (books: IBook[]) => void;
}

export const BookContext = createContext<IBookContext>({
  books: [],
  setBooks: (books: IBook[]) => {}
});

interface IBookProviderProps {
  children: ReactNode;
}

const BookProvider = ({ children }: IBookProviderProps) => {
  const [books, setBooks] = useState<IBook[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/books/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        });
        if (res.ok) {
          const data = await res.json();
          setBooks(data?.books?.map(mapPrismaBookToIBook) ?? []);
        } else {
          throw new Error(`Failed to fetch books: ${res.status}`);
        }
      } catch (error) {
        console.error(`An unexpected error occurred: ${(error as Error).message}`);
      }
    };

    fetchBooks();
  }, []);

  return (
    <BookContext.Provider value={{ books, setBooks }}>
      {children}
    </BookContext.Provider>
  );
};

export default BookProvider;