"use client";

import { useState, useContext, useEffect, FormEvent } from "react";
import { BookContext, IBook, BookFormValues, BOOK_CATEGORIES } from "@/src/app/context/BookContext";
import { BaseBookSchema } from "@/src/app/books/BookSchemaZod";
import { Formik, Form, Field } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";

const UpdateBookContent = ({
  params
}: {
  params: { id: string }
}) => {
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { books, setBooks } = useContext(BookContext);

  useEffect(() => {
    const newId = params.id;
    setId(newId);
  }, [params]);

  const initialValues: BookFormValues = {
    title: "",
    authors: "",
    description: "",
    isbn: "",
    publishedDate: "",
    categories : [],
    averageRating: 0,
    ratingsCount: 0,
    pageCount: 0,
    thumbnail: "",
    smallThumbnail: ""
  };

  const normalizeAuthors = (input: string) => {
    const parts = input
      .split(",")
      .map(part => part.trim())
      .filter(Boolean)
    ;

    return {
      author: parts[0],
      authors: parts.length > 1 ? parts : []
    };
  };

  const onSubmit = async (values: BookFormValues) => {
    console.log("Form data", values);

    const { author, authors } = normalizeAuthors(values.authors);

    const payload: Partial<IBook> = {
      title: values.title,
      author,
      authors,
      description: values.description,
      isbn: values.isbn,
      publishedDate: values.publishedDate,
      categories: values.categories,
      pageCount: values.pageCount,
      averageRating: values.averageRating,
      ratingsCount: values.ratingsCount,
      imageLinks: {
        thumbnail: values.thumbnail,
        smallThumbnail: values.smallThumbnail
      }
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
        <Formik
          initialValues={initialValues}
          validationSchema={toFormikValidationSchema(BaseBookSchema)}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, handleSubmit, errors, touched }) => (
            <Form
              onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <label htmlFor="title">Title:</label>
              <Field
                as="input"
                type="text"
                name="title"
                required
                className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
              />
              {errors.title && touched.title ? (
                <p className="text-sm text-red-400">
                  {errors.title}
                </p>
              ) : null}
              <label htmlFor="author">Author(s) <span>(comma-separated)</span>:</label>
              <Field
                as="input"
                type="text"
                name="authors"
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
                as="input"
                type="text"
                name="isbn"
                required
                className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
              />
              {errors.isbn && touched.isbn ? (
                <p className="text-sm text-red-400">
                  {errors.isbn}
                </p>
              ) : null}
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
              <label htmlFor="publishedDate">Publication Date:</label>
              <Field
                as="input"
                type="text"
                name="publishedDate"
                required
                className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
              />
              {errors.publishedDate && touched.publishedDate ? (
                <p className="text-sm text-red-400">
                  {errors.publishedDate}
                </p>
              ) : null}
              <label htmlFor="categories">Categories (select at least one):</label>
              <Field
                as="select"
                className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
                name="categories"
                multiple
              >
                {BOOK_CATEGORIES.map(category => (
                  <option value={`${category}`} key={category}>{category}</option>
                ))}
              </Field>
              <label htmlFor="pageCount">Page Count:</label>
              <Field
                as="input"
                type="number"
                name="pageCount"
                className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
              />
              <label htmlFor="averageRating">Average rating:</label>
              <Field
                as="input"
                type="number"
                name="averageRating"
                className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
              />
              <label htmlFor="ratingsCount">Ratings count:</label>
              <Field
                as="input"
                type="number"
                name="ratingsCount"
                className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
              />
              <label htmlFor="thumbnial">Thumbnail URL:</label>
              <Field
                as="input"
                type="text"
                name="thumbnail"
                className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
              />
              <label htmlFor="smallThumbnail">Small thumbnail URL:</label>
              <Field
                as="input"
                type="text"
                name="smallThumbnail"
                className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
              />
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