"use client";
import { BookContext } from "@/src/app/context/BookContext";
import DeleteBook from "../../components/DeleteBook";
import { useRouter } from "next/router";
import { authClient } from "@/src/auth-client";
import { useContext } from "react";

const BooksSection = () => {
  const { books } = useContext(BookContext);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  if (!session?.session && !session?.user) {
    alert("Please sign in first");
    router.push("/auth/signin");
  }

  return (
    <section id="books" className="space-y-4">
      <h2 className="text-xl font-semibold">Your Books</h2>
      {books.length === 0 ? (
        <p className="text-gray-600">You have no books added.</p>
      ) : (
        <ul className="space-y-2">
          {books.map((book) => (
            <li key={book.id} className="border p-4 rounded-md">
              <h3 className="text-lg font-medium">{book.title}</h3>
              {book.authors.length > 0 && (
                <p className="text-gray-700">Author: {book.authors.join(", ")}</p>
              )}
              {book.isbn && <p className="text-gray-700">ISBN: {book.isbn}</p>}
              <DeleteBook id={book.id} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default BooksSection;
