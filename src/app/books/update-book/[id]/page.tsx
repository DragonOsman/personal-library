"use client";

import { useState, useContext, useEffect, FormEvent } from "react";
import { BookContext } from "@/src/app/context/BookContext";
import { Formik, Form, Field } from "formik";
import { useAuth } from "@clerk/nextjs";
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
  const { userId } = useAuth();

  const baseUrl = process.env.NODE_ENV === "production" ?
    `${process.env.NEXT_PUBLIC_BASE_URLPROD}` :
    `${process.env.NEXT_PUBLIC_BASE_URLDEV}`
  ;

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
    readerId: userId ?? "",
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
    publicationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Publication date is required and must be in the format yyyy-mm-dd"),
    isbn: z.string().min(10, "ISBN must be at least 10 characters long"),
    genre: z.string().min(1, "Genre is required"),
  });

  const onSubmit = async (values: typeof initialValues & { id: number }) => {
    console.log("Form data", values);
    try {
      const formattedValues = {
        ...values,
        publicationDate: new Date(new Date(values.publicationDate).toLocaleDateString())
      };

      const response = await fetch(`${baseUrl}/api/books/update/:${Number(id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formattedValues),
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
                  placeholder="Enter Title"
                  title="Title"
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
                  placeholder="Enter Author's Name"
                  title="Author"
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
                  placeholder="Enter ISBN"
                  title="ISBN"
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
                  placeholder="Enter Synopsis"
                  type="text"
                  title="Synopsis"
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
                  placeholder="Enter Publication Date"
                  title="Publication Date"
                  type="text"
                  className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
                />
                {errors.publicationDate && touched.publicationDate ? (
                  <p className="text-sm text-red-400">
                    {errors.publicationDate as string}
                  </p>
                ) : null}
                <label htmlFor="genre">Genre:</label>
                <Field
                  {...getFieldProps("genre")}
                  required
                  placeholder="Enter Genre"
                  type="text"
                  title="Genre"
                  className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
                />
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