"use client";

import { createContext, ReactNode, useState } from "react";

export interface IBook {
  volumeInfo: {
    title: string;
    authors: string[];
    publisher: string;
    publishedDate: string;
    description: string;
    pageCount: number;
    categories: string[];
    averageRating: number;
    ratingsCount: number;
    imageLinks: {
      smallThumbnail: string;
      thumbnail: string;
    };
    language: string;
  };
  id: number;
  title: string;
  author: string;
  isbn: string;
  publicationDate: Date;
  readerIds: string[];
  synopsis: string;
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

  return (
    <BookContext.Provider value={{ books, setBooks }}>
      {children}
    </BookContext.Provider>
  );
};

export default BookProvider;