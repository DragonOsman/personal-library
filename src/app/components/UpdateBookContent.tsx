"use client";

import { useState, useContext, FormEvent } from "react";
import { BookContext, IBook } from "@/src/app/context/BookContext";
import { UpdateBookSchema } from "@/src/app/books/BookSchemaZod";
import { Formik, Form, Field } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";

const UpdateBookContent = ({
  params
}: {
  params: { id: string }
}) => {
  const id = params.id;
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { books, setBooks } = useContext(BookContext);

  const book = books.find(b => b.id === id);
  if (!book) {
    return <p>Loading book...</p>;
  }

  const initialValues: Partial<IBook> = {
    description: ""
  };

  const onSubmit = async (values: typeof initialValues) => {
    console.log("Form data", values);

    const payload: Partial<IBook> = {
      description: values.description
    };

    try {
      const response = await fetch(`/api/books/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...payload
        }),
        credentials: "include"
      });
      if (response.ok) {
        // Assuming the backend returns the updated book object in the response under a 'book' key
        const responseData = await response.json();

        if (!responseData.book) {
          throw new Error("Updated book data not found in response");
        }
        const updatedBookFromServer = responseData.book;
        setBooks(books.map(b => b.id === updatedBookFromServer.id ? updatedBookFromServer : b));
        setMessage("Book updated in library successfully!");
      } else {
        setMessage("Sorry, book couldn't be added to library");
        setError("Sorry, book couldn't be added to library");
      }
    } catch (err) {
      console.log(`An error occurred: ${err}`);
      setError(`An error occurred: ${err}`);
    }
  };

  return (
    <div className="UpdateBook flex justify-center">
      <div className="w-full max-w-md bg-white px-6 py-12 rounded-xl shadow-sm">
        <h1 className="text-black">Update A Book</h1>
        <div className="mb-4">
          <p><strong>Title:</strong> {book.title}</p>
          <p><strong>Author(s):</strong> {book.authors.join(", ")}</p>
          <p><strong>ISBN:</strong> {book.isbn}</p>
          <p><strong>Published Date:</strong> {book.publishedDate}</p>
          <p><strong>Current Description:</strong> {book.description}</p>
          <p><strong>Categories:</strong> {book.categories ? book.categories.join(", ") : "N/A"}</p>
          <p><strong>Page Count:</strong> {book.pageCount}</p>
          <p><strong>Average Rating:</strong> {book.averageRating}</p>
          <p><strong>Ratings Count:</strong> {book.ratingsCount}</p>
        </div>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={toFormikValidationSchema(UpdateBookSchema)}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, handleSubmit, errors, touched }) => (
            <Form
              onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <label htmlFor="description">Description:</label>
              <Field
                as="textarea"
                rows={4}
                cols={50}
                name="description"
                required
                className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
              />
              {errors.description && touched.description ? (
                <p className="text-sm text-red-400">
                  {errors.description}
                </p>
              ) : null}
              <button type="submit" disabled={isSubmitting}>
                Update Book
              </button>
              {error !== "" && <p>{error}</p>}
              {message !== ""&& <p className="text-green-500">{message}</p>}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateBookContent;