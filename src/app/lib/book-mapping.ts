import { IBook } from "../../app/context/BookContext";

export type BookFromQuery = {
  id: string;
  title: string;
  author: string;
  isbn?: string | null | undefined;
  userId: string;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
};

export const mapPrismaBookToIBook = (book: BookFromQuery): IBook => {
  return {
    id: book.id,
    userId: book.userId,
    title: book.title,
    author: book.author,
    authors: book.author ? [book.author] : [],
    isbn: book.isbn ? book.isbn : "",
    publishedDate: new Date().toString(),
    description: undefined,
    pageCount: undefined,
    categories: undefined,
    averageRating: undefined,
    ratingsCount: undefined,
    imageLinks: undefined,
    language: "English",
    createdAt: book.createdAt,
    updatedAt: book.updatedAt
  };
};