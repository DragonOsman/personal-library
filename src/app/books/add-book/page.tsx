"use client";

import { useState, useContext } from "react";
import { BookContext } from "@/src/app/context/BookContext";
import { Formik, Form, Field } from "formik";
import { useAuth } from "@clerk/nextjs";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const AddBook = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { books, setBooks } = useContext(BookContext);
  const { userId } = useAuth();

  const baseUrl = process.env.NODE_ENV === "production" ?
    `${process.env.NEXT_PUBLIC_BASE_URLPROD}` :
    `${process.env.NEXT_PUBLIC_BASE_URLDEV}`
  ;

  const initialValues = {
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

  const onSubmit = async (values: typeof initialValues) => {
    console.log("Form data", values);
    try {
      const formattedValues = {
        ...values,
        publicationDate: new Date(new Date(values.publicationDate).toLocaleDateString())
      };

      const response = await fetch(`${baseUrl}/api/books/add-book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formattedValues),
        credentials: "include"
      });
      if (response.ok) {
        setBooks([...books, { ...values }]);
        setMessage("Book added successfully");
      } else {
        setError("Couldn't add book");
      }
    } catch (err) {
      console.log(`An error occurred: ${err}`);
    }
  };

  return (
    <div className="AddBook">
      <h1>Add a New Book</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(validationSchema)}
        onSubmit={onSubmit}
      >
        {formik => (
          <Form
            onSubmit={
              (event) => {
                event.preventDefault();
                formik.handleSubmit();
              }
            }
          >
            <label htmlFor="title">Title:</label>
            <Field
              {...formik.getFieldProps("title")}
              required
              placeholder="Title"
              title="Enter Title"
              className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
            />
            {formik.errors.title && formik.touched.title ? (
              <p className="text-sm text-red-400">
                {formik.errors.title}
              </p>
            ) : null}
            <label htmlFor="author">Author:</label>
            <Field
              {...formik.getFieldProps("author")}
              required
              placeholder="Author"
              title="Enter Author's Name"
              className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
            />
            {formik.errors.author && formik.touched.author ? (
              <p className="text-sm text-red-400">
                {formik.errors.author}
              </p>
            ) : null}
            <label htmlFor="isbn">ISBN:</label>
            <Field
              {...formik.getFieldProps("isbn")}
              required
              placeholder="Enter ISBN"
              title="Enter ISBN"
              className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
            />
            {formik.errors.isbn && formik.touched.isbn ? (
              <p className="text-sm text-red-400">
                {formik.errors.isbn}
              </p>
            ) : null}
            <label htmlFor="synopsis">Synopsis:</label>
            <Field
              {...formik.getFieldProps("synopsis")}
              required
              type="text"
              placeholder="Enter Synopsis"
              title="Enter Synopsis"
              className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
            />
            {formik.errors.synopsis && formik.touched.synopsis ? (
              <p className="text-sm text-red-400">
                {formik.errors.synopsis}
              </p>
            ) : null}
            <label htmlFor="publicationDate">Publication Date:</label>
            <Field
              {...formik.getFieldProps("publicationDate")}
              required
              type="text"
              placeholder="Publication Date"
              title="Enter Publication Date"
              className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
            />
            {formik.errors.publicationDate && formik.touched.publicationDate ? (
              <p className="text-sm text-red-400">
                {formik.errors.publicationDate as string}
              </p>
            ) : null}
            <label htmlFor="genre">Genre:</label>
            <Field
              {...formik.getFieldProps("genre")}
              required
              placeholder="Enter Genre"
              title="Enter Genre"
              className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
            />
            {formik.errors.genre && formik.touched.genre ? (
              <p className="text-sm text-red-400">
                {formik.errors.genre}
              </p>
            ) : null}
            <input
              type="button"
              value="Add Book"
              className="text-white w-full sm:w-auto bg-blue-300 hover:bg-blue-400 rounded-md text-center p-2"
            />
            {error !== "" && <p className="text-red-600 text-sm">{error}</p>}
            {message !== "" && <p className="text-sm">{message}</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddBook;
