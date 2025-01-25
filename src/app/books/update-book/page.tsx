"use client";

import { useState, useContext } from "react";
import { BookContext } from "@/src/app/context/BookContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const UpdateBookPage = () => {
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [publicationDate, setPublicationDate] = useState(new Date());
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const { books, setBooks } = useContext(BookContext);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const handleUpdate = async (id: number) => {
    setEditing(true);
    const response = await fetch(`${baseUrl}/api/books/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
    if (response.ok) {
      console.log("Book updated successfully");
    }
  };

  const initialValues = {
    title,
    author,
    synopsis,
    isbn,
    publicationDate
  };

  const validationSchema = z.object({
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author is required"),
    synopsis: z.string().min(1, "Synopsis is required"),
    publicationDate: z.date().min(new Date(1450, 0, 1), "Publication date must be after January 1, 1450"),
    isbn: z.string().min(10, "ISBN must be at least 10 characters long")
  });

  const onSubmit = async (values: typeof initialValues & { id: number }) => {
    console.log("Form data", values);
    try {
      const response = await fetch(`${baseUrl}/api/books/update/${values.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values),
        credentials: "include"
      });
      if (response.ok) {
        setBooks([...books, { ...values }]);
        alert("Book added to library successfully!");
      } else {
        alert("Sorry, book couldn't be added to library");
      }
    } catch (err) {
      console.log(`An error occurred: ${err}`);
    }
  };

  return (
    <div>
      <h1>Update A Book</h1>
      <ul>
        <>
          {books.map((book) => (
            <li key={book.id}>
              {book.title}
              <button
                type="button"
                onClick={() => handleUpdate(book.id!)}
              >
                Update Book
              </button>
              {editing && (
                <Formik
                  initialValues={initialValues}
                  validationSchema={toFormikValidationSchema(validationSchema)}
                  onSubmit={(values) => onSubmit({ ...values, id: book.id! })}
                >
                  {({ getFieldProps, errors, touched, handleSubmit }) => (
                    <Form
                      onSubmit={
                        (event) => {
                          event.preventDefault();
                          handleSubmit();
                        }
                      }
                    >
                      <label htmlFor="title">Title:</label>
                      <Field
                        {...getFieldProps("title")}
                        required
                        className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400"
                      />
                      {errors.title && touched.title ? (
                        <p className="text-sm text-red-400">
                          {errors.title}
                        </p>
                      ) : null}
                      <ErrorMessage name="title" />
                      <label htmlFor="author">Author:</label>
                      <Field
                        {...getFieldProps("author")}
                        required
                        className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400"
                      />
                      {errors.author && touched.author ? (
                        <p className="text-sm text-red-400">
                          {errors.author}
                        </p>
                      ) : null}
                      <ErrorMessage name="author" />
                      <label htmlFor="isbn">ISBN:</label>
                      <Field
                        {...getFieldProps("isbn")}
                        required
                        className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400"
                      />
                      {errors.isbn && touched.isbn ? (
                        <p className="text-sm text-red-400">
                          {errors.isbn}
                        </p>
                      ) : null}
                      <ErrorMessage name="isbn" />
                      <label htmlFor="synopsis">Synopsis:</label>
                      <Field
                        {...getFieldProps("synopsis")}
                        required
                        className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400"
                      />
                      {errors.synopsis && touched.synopsis ? (
                        <p className="text-sm text-red-400">
                          {errors.synopsis}
                        </p>
                      ) : null}
                      <ErrorMessage name="synopsis" />
                      <label htmlFor="publicationDate">Publication Date:</label>
                      <Field
                        {...getFieldProps("publicationDate")}
                        required
                        className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400"
                      />
                      {errors.publicationDate && touched.publicationDate ? (
                        <p className="text-sm text-red-400">
                          {errors.publicationDate as string}
                        </p>
                      ) : null}
                      <ErrorMessage name="publicationDate" />
                      <input
                        type="button"
                        value="Edit Book"
                        className="text-white w-full sm:w-auto bg-blue-300 hover:bg-blue-400 rounded-md text-center"
                      />
                      {error && <p className="text-red-600 text-sm">{error}</p>}
                    </Form>
                  )}
                </Formik>
              )}
            </li>
          ))}
        </>
      </ul>
    </div>
  );
};

export default UpdateBookPage;