"use client";

import { useContext } from "react";
import { BookContext } from "@/src/app/context/BookContext";

const DeleteBookPage = () => {
  const { books, setBooks } = useContext(BookContext);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const handleDelete = async (id: number) => {
    const response = await fetch(`${baseUrl}/api/books/delete/:${id}`, {
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

  return (
    <div>
      <h1>Delete A Book</h1>
      <ul>
        <>
          {books.map((book) => (
            <li key={book.id}>
              {book.title}
              <button
                type="button"
                onClick={() => handleDelete(book.id!)}
              >
                Delete
              </button>
            </li>
          ))}
        </>
      </ul>
    </div>
  );
};

export default DeleteBookPage;