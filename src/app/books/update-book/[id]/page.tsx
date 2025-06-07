"use client";

import { useState, useContext, useEffect, FormEvent } from "react";
import { BookContext } from "@/src/app/context/BookContext";
import { Formik, Form, Field } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const UpdateBookPage = ({
  params
}: {
  params: Promise<{ id: string }>
}) => {
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const { books, setBooks } = useContext(BookContext);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const initId = async () => {
      const newId = (await params).id;
      setId(newId);
    };

    initId();
  }, [params]);

  const initialValues = {
    id,
    title: "",
    authors: [],
    description: "",
    isbn: "",
    publishedDate: ""
  };

  const validationSchema = z.object({
    title: z.string().min(1, "Title is required"),
    authors: z.array(z.string()).min(1, "Author is required"),
    description: z.string().min(1, "Synopsis is required"),
    publishedDate: z.string().min(1, "Publication date must be after January 1, 1450 and be in valid format"),
    isbn: z.string().min(10, "ISBN must be at least 10 characters long")
  });

  const onSubmit = async (values: typeof initialValues & { id: string }) => {
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
        // Assuming the backend returns the updated book object in the response under a 'book' key
        const responseData = await response.json();
        const updatedBookFromServer = responseData.book; // Or however your backend structures it
        setBooks(books.map(b => b.id === updatedBookFromServer.id ? updatedBookFromServer : b));
        alert("Book updated in library successfully!");
      } else {
        alert("Sorry, book couldn't be added to library");
        setError("Sorry, book couldn't be added to library");
      }
    } catch (err) {
      console.log(`An error occurred: ${err}`);
      setError(`An error occurred: ${err}`);
    }
  };

  return (
    <div className="UpdateBook">
      <h1>Update A Book</h1>
        <>
          <Formik
            initialValues={initialValues}
            validationSchema={toFormikValidationSchema(validationSchema)}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, handleSubmit, getFieldProps, errors, touched }) => (
              <Form
                onSubmit={(e: FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <label htmlFor="title">Title:</label>
                <Field
                  {...getFieldProps("title")}
                  required
                  className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
                />
                {errors.title && touched.title ? (
                  <p className="text-sm text-red-400">
                    {errors.title}
                  </p>
                ) : null}
                <label htmlFor="author">Author:</label>
                <Field
                  {...getFieldProps("authors")}
                  required
                  className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
                />
                {errors.authors && touched.authors ? (
                  <p className="text-sm text-red-400">
                    {errors.authors}
                  </p>
                ) : null}
                <label htmlFor="isbn">ISBN:</label>
                <Field
                  {...getFieldProps("isbn")}
                  required
                  className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
                />
                {errors.isbn && touched.isbn ? (
                  <p className="text-sm text-red-400">
                    {errors.isbn}
                  </p>
                ) : null}
                <label htmlFor="synopsis">Synopsis:</label>
                <Field
                  {...getFieldProps("description")}
                  required
                  className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
                />
                {errors.description && touched.description ? (
                  <p className="text-sm text-red-400">
                    {errors.description}
                  </p>
                ) : null}
                <label htmlFor="publicationDate">Publication Date:</label>
                <Field
                  {...getFieldProps("publishedDate")}
                  required
                  className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
                />
                {errors.publishedDate && touched.publishedDate ? (
                  <p className="text-sm text-red-400">
                    {errors.publishedDate}
                  </p>
                ) : null}
                <button type="submit" disabled={isSubmitting}>
                  Update Book
                </button>
                {error !== "" && <p>{error}</p>}
              </Form>
            )}
          </Formik>
        </>
    </div>
  );
};

export default UpdateBookPage;