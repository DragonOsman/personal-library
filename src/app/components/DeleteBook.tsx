import { BookContext, IBook } from "@/src/app/context/BookContext";
import { useContext, useCallback } from "react";

interface DeleteBooksProps {
  id: string
}

const DeleteBook = ({ id }: DeleteBooksProps) => {
  const { setBooks } = useContext(BookContext);
  const bookId = id;

  const handleDelete = useCallback(async (id: string) => {
    const response = await fetch(`/api/books/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
    if (response.ok) {
      setBooks((prev: IBook[]) => prev.filter(book => book.id !== id));
    }
  }, [setBooks]);

  return (
    <button
      type="button"
      onClick={() => handleDelete(bookId)}
    >
      Delete
    </button>
  );
};

export default DeleteBook;