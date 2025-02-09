"use client";

import { useState, useContext, useCallback, ChangeEvent } from "react";
import { BookContext } from "@/src/app/context/BookContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const AddBook = () => {
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [publicationDate, setPublicationDate] = useState(new Date());
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { books, setBooks } = useContext(BookContext);

  const uriEncodedTitle = encodeURIComponent(title);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const initialValues = {
    title,
    author,
    synopsis,
    isbn,
    publicationDate
  };

  const searchBooks = useCallback(async () => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${uriEncodedTitle}+isbn:${isbn}&inauthor:${isbn}&key=${apiKey}`);
      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          const handleResultClick = (book: {
            industryIdentifiers?: { identifier: string }[];
            title?: string;
            isbn?: string;
            authors?: string[];
            description?: string;
            publicationDate?: string
          }) => {
            if (window.confirm("Do you want to add this book to your library?")) {
              setTitle(book.title || "");
              setIsbn(book.isbn || "");
              setAuthor(book.authors ? book.authors.join(", ") : "");
              setSynopsis(book.description || "");
              setPublicationDate(book.publicationDate ? new Date(book.publicationDate) : new Date());
              setBooks([...books, {
                title: book.title || "",
                author: book.authors ? book.authors.join(", ") : "",
                isbn: book.industryIdentifiers && book.industryIdentifiers.length > 0 ? book.industryIdentifiers[0].identifier : "",
                publicationDate: new Date(),
                synopsis: book.description || ""
              }]);
            }
          };

          data.items.forEach((item: {
            id: string;
            volumeInfo: {
              description: string;
              title: string;
              authors: string[];
              industryIdentifiers?: { identifier: string }[]
            }
          }) => {
            const book = item.volumeInfo;
            handleResultClick(book);
          });
        }
      }
    } catch (err) {
      console.error(`An error occurred while searching for books: ${err}`);
      setError(`An error occurred while searching for books: ${err}`);
    }
  }, [apiKey, books, isbn, setBooks, uriEncodedTitle]);

  const validationSchema = z.object({
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author is required"),
    synopsis: z.string().min(1, "Synopsis is required"),
    publicationDate: z.date().min(new Date(1450, 0, 1), "Publication date must be after January 1, 1450"),
    isbn: z.string().min(10, "ISBN must be at least 10 characters long")
  });

  const onSubmit = async (values: typeof initialValues) => {
    console.log("Form data", values);
    try {
      const response = await fetch(`${baseUrl}/api/books/add-book`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...values }),
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
      <form
        onSubmit={
          async (event) => {
            event.preventDefault();
            await searchBooks();
          }
        }
        className="searchBooks"
      >
        <label htmlFor="search">Search for a book:</label>
        <input
          id="search"
          name="search"
          type="text"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setTitle(e.target.value);
          }}
          className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
        />
        <input
          type="submit"
          value="Search"
          className="text-white w-full sm:w-auto bg-blue-300 hover:bg-blue-400 rounded-md text-center p-2"
        />
      </form>
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
              className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
            />
            {formik.errors.publicationDate && formik.touched.publicationDate ? (
              <p className="text-sm text-red-400">
                {formik.errors.publicationDate as string}
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
