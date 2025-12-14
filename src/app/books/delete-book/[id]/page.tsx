"use client";

import { useContext, useEffect, useState } from "react";
import { BookContext } from "@/src/app/context/BookContext";

const DeleteBookPage = ({ params }: { params: { id: string } }) => {
  const { books, setBooks } = useContext(BookContext);
  const [id, setId] = useState("");

  useEffect(() => {
    const newId = params.id;
    setId(newId);
  }, [params]);

  const handleDelete = async () => {
    const response = await fetch(`/api/books/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
    if (response.ok) {
      setBooks(books.filter((book) => book.id !== id));
      console.log("Book deleted successfully");
    }
  };

  return (
    <div className="DeleteBook">
      <h1>Delete A Book</h1>
      <ul>
        <>
          {books.map((book) => (
            <li key={book.id}>
              {book.title}
              <button
                type="button"
                onClick={() => handleDelete()}
              >
                Delete
              </button>
            </li>
          ))}
          {books.length === 0 && (
            <li>
              <p>No books to delete</p>
            </li>
          )}
        </>
      </ul>
    </div>
  );
};

export default DeleteBookPage;