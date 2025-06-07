"use client";

import { useState, useContext } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { BookContext, IBookContext, IBook } from "@/src/app/context/BookContext";

const OnboardingPage = () => {
  const { user } = useUser();
  const { books, setBooks } = useContext<IBookContext>(BookContext);
  const [query, setQuery] = useState("");

  const handleAddBook = (book: IBook) => {
    setBooks([...books, book]);
  };

  const searchBooks = async () => {
    if (!query) {
      return;
    }

    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
      const data = await response.json();
      const books: IBook[] = data.items.map((item: any, index: number) => ({
        id: index,
        volumeInfo: {
          ...item.volumeInfo,
          publisher: item.volumeInfo.publisher || "Unknown Publisher",
          description: item.volumeInfo.description || "No description available"
        },
        title: item.volumeInfo.title
      }));

      data.items.map((item: any) => setBooks([...books, {
        id: item.volumeInfo.industryIdentifiers?.[0]?.identifier,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors?.join(", ") || "Unknown Author",
        isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier || "N/A",
        publishedDate: item.volumeInfo.publishedDate,
        description: item.volumeInfo.description || "No description available"
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
                  src={book.imageLinks?.thumbnail || "../../book-composition-with-open-book_23-2147690555.jpg"}
                  alt={book.title}
                  width={128}
                  height={192}
                />
                <Image
                  src={book.imageLinks?.thumbnail || "../../book-composition-with-open-book_23-2147690555.jpg"}
                  alt={book.title}
                  width={128}
                  height={192}
                />
                <p>Author: {book.authors?.join(", ") || "Unknown Author"}</p>
                <p>Publisher: {book.publisher || "Unknown Publisher"}</p>
                <p>Published Date: {book.publishedDate || "Unknown Date"}</p>
                <p>Description: {book.description || "No description available"}</p>
                <button
                  type="button"
                  onClick={() => handleAddBook(book)}
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