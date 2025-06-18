"use client";

import { useState, useContext, useCallback, ChangeEvent, FormEvent } from "react";
import { BookContext, IBook } from "@/src/app/context/BookContext";
import { Formik, Form, Field } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

interface GoogleApiVolumeInfo {
  title: string;
  authors?: string[];
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: Array<{ type: string; identifier: string }>;
  pageCount?: number;
  categories?: string[];
  imageLinks?: {
    thumbnail: string;
    smallThumbnail?: string;
  };
  language?: string;
}

interface GoogleApiBookItem {
  id?: string;
  volumeInfo: GoogleApiVolumeInfo;
}

const AddBook = () => {
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState<string>("");
  const [description, setDescription] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { books, setBooks } = useContext(BookContext);
  const [searchResults, setSearchResults] = useState<GoogleApiVolumeInfo[]>([]);

  const uriEncodedTitle = encodeURIComponent(title);
  const baseUrl = process.env.NODE_ENV === "production" ?
    `${process.env.NEXT_PUBLIC_BASE_URLPROD}` :
    `${process.env.NEXT_PUBLIC_BASE_URLDEV}`
  ;

  // Renamed to be more specific for adding from search results
  const handleAddBookFromSearch = async (volumeInfo: GoogleApiVolumeInfo) => {
    if (window.confirm("Do you want to add this book to your library?")) {
      // Map Google Books API data to IBook structure
      const bookToAdd: Partial<IBook> = {
        title: volumeInfo.title,
        authors: volumeInfo.authors || [],
        publishedDate: volumeInfo.publishedDate,
        description: volumeInfo.description,
        isbn: volumeInfo.industryIdentifiers?.find((id: { type: string; identifier: string }) => id.type === "ISBN_13" || id.type === "ISBN_10")?.identifier,
        pageCount: volumeInfo.pageCount,
        categories: volumeInfo.categories,
        imageLinks: volumeInfo.imageLinks,
        language: volumeInfo.language
      };

      // Basic validation for required fields (matching backend)
      if (!bookToAdd.title || !bookToAdd.authors || bookToAdd.authors.length === 0 || !bookToAdd.publishedDate || !bookToAdd.isbn || !bookToAdd.description) {
        setError("Selected book is missing required information (title, authors, published date, ISBN, or description).");
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/api/books/add-book`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookToAdd),
          credentials: "include"
        });

        if (response.ok) {
          const responseData = await response.json();
          const addedBook: IBook = responseData.book;
          setBooks([...books, addedBook]);
          setMessage("Book added to library successfully!");
          setSearchResults([]); // Clear search results
          // Clear form fields
          setTitle("");
          setAuthors("");
          setDescription("");
          setPublishedDate("");
          setIsbn("");
          // Consider resetting Formik form if it was populated
        } else {
          const errorData = await response.json();
          setError(`Failed to add book: ${errorData.message || response.statusText}`);
        }
      } catch (err) {
        console.error("Error adding book from search:", err);
        setError(`An error occurred: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  };


  const initialValues = {
    id: "",
    title,
    authors,
    description,
    isbn,
    publishedDate
  };

  const searchBooks = useCallback(async () => {
    setError(""); // Clear previous errors
    try {
      const response = await fetch(`${baseUrl}/api/books/search?title=${uriEncodedTitle}`);
      if (response.ok) {
        const data = await response.json();
        for (const dataItem of Object.entries(data)) {
          console.log(`Data item: ${dataItem}`);
        }

        if (data.items && data.items.length > 0) {
          setSearchResults(data.items.map((item: GoogleApiBookItem) => item.volumeInfo));
        } else {
          setSearchResults([]);
          setError("No books found matching your search criteria.");
        }
      }
    } catch (err) {
      console.error(`An error occurred while searching for books: ${err}`);
      setError(`An error occurred while searching for books: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [uriEncodedTitle, baseUrl]);

  const validationSchema = z.object({
    title: z.string().min(1, "Title is required"),
    authors: z.string().min(1, "One or more Author name(s) is/are required"),
    description: z.string().min(1, "Description is required"),
    publishedDate: z.string().min(1, "Publication date must be after January 1, 1450 and be in a valid date format"),
    isbn: z.string().min(10, "ISBN must be at least 10 characters long")
  });

  const onSubmit = async (values: typeof initialValues, { resetForm }: { resetForm: () => void }) => {
    console.log("Form data", values);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`${baseUrl}/api/books/add-book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...values,
          authors: values.authors.includes(",") ?
            values.authors.split(",").map((author: string) => author.trim()) :
            [values.authors.trim()]
        }),
        credentials: "include"
      });
      if (response.ok) {
        const responseData = await response.json();
        const addedBook: IBook = responseData.book;
        setBooks([...books, addedBook]);
        setMessage("Book added successfully");
        resetForm(); // Reset Formik form
        // Also reset local state if not fully controlled by Formik
        setTitle("");
        setAuthors("");
        setDescription("");
        setPublishedDate("");
        setIsbn("");
      } else {
        const errorData = await response.json();
        setError(`Couldn't add book: ${errorData.message || "Please check your input."}`);
      }
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="AddBook">
      <h1>Add a New Book</h1>
      <form
        onSubmit={async (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          await searchBooks();
        }}
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
        enableReinitialize // Important if initialValues can change from state
        validationSchema={toFormikValidationSchema(validationSchema)}
        onSubmit={onSubmit}
      >
        {formik => (
          <Form
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              formik.handleSubmit();
            }}
          >
            <label htmlFor="title">Title:</label>
            <Field
              as="input"
              type="text"
              {...formik.getFieldProps("title")}
              required
              className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
            />
            {formik.errors.title && formik.touched.title ? (
              <p className="text-sm text-red-400">
                {formik.errors.title}
              </p>
            ) : null}
            <label htmlFor="authors">Author(s):</label>
            <Field
              as="input"
              type="text"
              {...formik.getFieldProps("authors")}
              required
              className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
            />
            {formik.errors.authors && formik.touched.authors ? (
              <p className="text-sm text-red-400">
                {formik.errors.authors}
              </p>
            ) : null}
            <label htmlFor="isbn">ISBN:</label>
            <Field
              as="input"
              type="text"
              {...formik.getFieldProps("isbn")}
              required
              className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
            />
            {formik.errors.isbn && formik.touched.isbn ? (
              <p className="text-sm text-red-400">
                {formik.errors.isbn}
              </p>
            ) : null}
            <label htmlFor="description">Description:</label>
            <Field
              as="textarea"
              rows={4}
              cols={50}
              {...formik.getFieldProps("description")}
              required
              className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
            />
            {formik.errors.description && formik.touched.description ? (
              <p className="text-sm text-red-400">
                {formik.errors.description}
              </p>
            ) : null}
            <label htmlFor="publishedDate">Publication Date:</label>
            <Field
              as="input"
              type="text"
              {...formik.getFieldProps("publishedDate")}
              required
              className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
            />
            {formik.errors.publishedDate && formik.touched.publishedDate ? (
              <p className="text-sm text-red-400">
                {formik.errors.publishedDate}
              </p>
            ) : null}
            <button
              type="submit"
              className="text-white w-full sm:w-auto bg-blue-300 hover:bg-blue-400 rounded-md text-center p-2"
              disabled={formik.isSubmitting}
            >Add Book Manually
            </button>
            {error !== "" && <p className="text-red-600 text-sm">{error}</p>}
            {message !== "" && <p className="text-sm">{message}</p>}
          </Form>
        )}
      </Formik>

      {searchResults.length > 0 && (
        <div className="search-results mt-4">
          <h2>Search Results</h2>
          <ul>
            {searchResults.map((result: GoogleApiVolumeInfo, index) => (
              <li key={index} className="mb-2 border-b pb-2">
                <div>
                  <strong>{result.title}</strong> by {result.authors?.join(", ")}
                </div>
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded mt-1"
                  onClick={() => handleAddBookFromSearch(result)}
                  title="Add this book to your library"
                  type="button"
                >
                  Add Book
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddBook;
