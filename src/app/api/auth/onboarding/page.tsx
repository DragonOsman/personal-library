"use client";

import { useState, useContext } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { BookContext, IBookContext, IBook } from "@/src/app/context/BookContext";
interface VolumeInfo {
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  industryIdentifiers?: { type: string; identifier: string }[];
  readingModes?: { text: boolean; image: boolean };
  pageCount: number;
  printType?: string;
  categories: string[];
  averageRating: number;
  ratingsCount: number;
  maturityRating?: string;
  allowAnonLogging?: boolean;
  contentVersion?: string;
  panelizationSummary?: { containsEpubBubbles: boolean; containsImageBubbles: boolean };
  imageLinks: { smallThumbnail: string; thumbnail: string };
  language: string;
  previewLink?: string;
  infoLink: string;
  canonicalVolumeLink: string;
}

interface Book extends IBook {
  id: number;
  volumeInfo: VolumeInfo;
}

const OnboardingPage = () => {
  const { user } = useUser();
  const { books, setBooks } = useContext<IBookContext>(BookContext);
  const [query, setQuery] = useState("");

  const handleAddBook = (book: Book) => {
    setBooks([...books, book]);
  };

  const searchBooks = async () => {
    if (!query) {
      return;
    }

    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
      const data = await response.json();
      const books: Book[] = data.items.map((item: { volumeInfo: VolumeInfo }, index: number) => ({
        id: index,
        volumeInfo: {
          ...item.volumeInfo,
          publisher: item.volumeInfo.publisher || "Unknown Publisher",
          description: item.volumeInfo.description || "No description available"
        },
        title: item.volumeInfo.title
      }));

      data.items.map((item: { volumeInfo: VolumeInfo }, index: number) => setBooks([...books, {
        id: index,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors?.join(", ") || "Unknown Author",
        isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier || "N/A",
        publicationDate: new Date(item.volumeInfo.publishedDate as string),
        readerIds: [],
        synopsis: item.volumeInfo.description || "No description available",
        volumeInfo: {
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors || ["Unknown Author"],
          publisher: item.volumeInfo.publisher || "Unknown Publisher",
          publishedDate: item.volumeInfo.publishedDate ? new Date(item.volumeInfo.publishedDate).toLocaleDateString() : "Unknown Date",
          description: item.volumeInfo.description || "No description available",
          pageCount: item.volumeInfo.pageCount ?? 0,
          categories: item.volumeInfo.categories ?? ["Uncategorized"],
          averageRating: item.volumeInfo.averageRating ?? 0,
          ratingsCount: item.volumeInfo.ratingsCount ?? 0,
          imageLinks: item.volumeInfo.imageLinks ?? { smallThumbnail: "", thumbnail: "" },
          language: item.volumeInfo.language ?? "Unknown"
        }
      }]));
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  return (
    <div>
      <h1>Welcome to the Onboarding Page</h1>
      {user ? (
        <div>
          <p>Hello, {user.firstName}!</p>
          <p>Let&apos;s get you set up.</p>
          <div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for books"
            />
            <button type="button" onClick={searchBooks}>Search</button>
          </div>
          <div>
            {books.map((book) => (
              <div key={book.id}>
                <Image
                  src={book.volumeInfo.imageLinks?.thumbnail}
                  alt={book.title}
                  width={128}
                  height={192}
                />
                <Image
                  src={book.volumeInfo.imageLinks?.thumbnail}
                  alt={book.title}
                  width={128}
                  height={192}
                />
                <p>Author: {book.volumeInfo.authors?.join(", ") || "Unknown Author"}</p>
                <p>Publisher: {book.volumeInfo.publisher || "Unknown Publisher"}</p>
                <p>Published Date: {book.volumeInfo.publishedDate || "Unknown Date"}</p>
                <p>Description: {book.volumeInfo.description || "No description available"}</p>
                <button
                  type="button"
                  onClick={() => handleAddBook(book as Book)}
                >
                  Add to Library
                </button>
              </div>
            ))}
          </div>
          <div>
            <h2>Selected Books</h2>
            {books.map((book) => (
              <p key={book.id}>{book.title}</p>
            ))}
          </div>
          <div>
            <button
              type="button"
              onClick={() => alert("Books added to library!")}
            >
              Add Selected Books to Library
            </button>
            <button
              type="button"
              onClick={() => alert("You can add books later.")}
            >
              I&apos;ll do it later
            </button>
          </div>
        </div>
      ) : (
        <p>Please sign in to continue.</p>
      )}
    </div>
  );
};
export default OnboardingPage;