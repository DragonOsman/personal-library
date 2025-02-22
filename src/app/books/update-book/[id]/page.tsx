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
    id: 0,
    title: "",
    author: "",
    synopsis: "",
    isbn: "",
    publicationDate: new Date(),
    readerId: "",
    genre: "",
    imageLinks: {
      smallThumbnail: "",
      thumbnail: ""
    }
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
      const response = await fetch(`${baseUrl}/api/books/update/${Number(id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values),
        credentials: "include"
      });
      if (response.ok) {
        setBooks([...books, { ...values }]);
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
                  {...getFieldProps("author")}
                  required
                  className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
                />
                {errors.author && touched.author ? (
                  <p className="text-sm text-red-400">
                    {errors.author}
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
                  {...getFieldProps("synopsis")}
                  required
                  className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
                />
                {errors.synopsis && touched.synopsis ? (
                  <p className="text-sm text-red-400">
                    {errors.synopsis}
                  </p>
                ) : null}
                <label htmlFor="publicationDate">Publication Date:</label>
                <Field
                  {...getFieldProps("publicationDate")}
                  required
                  className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
                />
                {errors.publicationDate && touched.publicationDate ? (
                  <p className="text-sm text-red-400">
                    {errors.publicationDate as string}
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