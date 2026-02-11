"use client";

import { createContext, ReactNode, useState, useEffect, Dispatch, SetStateAction } from "react";

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
  userId?: string;
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
  }
  language?: string;
  updatedAt?: Date | null | undefined;
  createdAt?: Date | null | undefined;
  isbn?: string | null | undefined;
}

export const BOOK_CATEGORIES = [
  "Fiction",
  "Nonfiction",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Thriller",
  "Romance",
  "Horror",
  "Historical Fiction",
  "Biography",
  "Autobiography",
  "History",
  "Philosophy",
  "Psychology",
  "Self-Help",
  "Business",
  "Economics",
  "Politics",
  "Religion",
  "Spirituality",
  "Science",
  "Technology",
  "Computers",
  "Programming",
  "Mathematics",
  "Engineering",
  "Medicine",
  "Health",
  "Fitness",
  "Education",
  "Reference",
  "Language",
  "Art",
  "Photography",
  "Music",
  "Film",
  "Design",
  "Comics & Graphic Novels",
  "Manga",
  "Poetry",
  "Drama",
  "Children",
  "Young Adult",
  "Travel",
  "Cooking",
  "Food & Drink",
  "Crafts & Hobbies",
  "Sports",
  "Nature"
];

export interface BookFormValues {
  title: string;
  authors: string;
  description: string;
  isbn: string;
  publishedDate: string;
  categories: string[];
  pageCount?: number;
  averageRating?: number;
  ratingsCount?: number;
  thumbnail?: string;
  smallThumbnail?: string;
}

export interface IBookContext {
  books: IBook[];
  setBooks: Dispatch<SetStateAction<IBook[]>>;
}

export const BookContext = createContext<IBookContext>({
  books: [],
  setBooks: () => {}
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
          setBooks(data?.books ?? []);
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