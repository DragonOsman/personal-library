"use client";

import { useState, useContext, useCallback, ChangeEvent, FormEvent } from "react";
import { BookContext, IBook, BookFormValues, BOOK_CATEGORIES } from "@/src/app/context/BookContext";
import { BaseBookSchema } from "../BookSchemaZod";
import { Formik, Form, Field } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { getRouteTitle, getRouteKeywords } from "@/src/app/lib/routeTitles";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  const pathname = "/books/add-book";
  const title = getRouteTitle(pathname);
  const keywords = getRouteKeywords(pathname);

  return {
    title,
    keywords
  };
};

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
  averageRating?: number;
  ratingsCount?: number;
}

interface GoogleApiBookItem {
  id?: string;
  volumeInfo: GoogleApiVolumeInfo;
}

const AddBook = () => {
  const [searchTitle, setSearchTitle] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { books, setBooks } = useContext(BookContext);
  const [searchResults, setSearchResults] = useState<GoogleApiVolumeInfo[]>([]);

  const uriEncodedTitle = encodeURIComponent(searchTitle);

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

  // Renamed to be more specific for adding from search results
  const handleAddBookFromSearch = async (
    volumeInfo: GoogleApiVolumeInfo
  ) => {
    if (window.confirm("Do you want to add this book to your library?")) {
      // Map Google Books API data to IBook structure
      const bookToAdd: Partial<IBook> = {
        title: volumeInfo.title,
        author: volumeInfo.authors?.[0],
        authors: volumeInfo.authors,
        publishedDate: volumeInfo.publishedDate || Date.now().toString(),
        description: volumeInfo.description,
        isbn: volumeInfo.industryIdentifiers?.find((id: { type: string; identifier: string }) => id.type === "ISBN_13" || id.type === "ISBN_10")?.identifier,
        pageCount: volumeInfo.pageCount,
        categories: volumeInfo.categories,
        imageLinks: {
          thumbnail: volumeInfo?.imageLinks?.thumbnail,
          smallThumbnail: volumeInfo?.imageLinks?.smallThumbnail
        },
        language: volumeInfo.language,
        averageRating: volumeInfo?.averageRating,
        ratingsCount: volumeInfo?.ratingsCount
      };

      // Basic validation for required fields (matching backend)
      if (!bookToAdd.title || !bookToAdd.authors || bookToAdd.authors.length === 0 || !bookToAdd.publishedDate || !bookToAdd.isbn || !bookToAdd.description) {
        setError("Selected book is missing required information (title, authors, published date, ISBN, or description).");
        return;
      }

      try {
        const response = await fetch(`/api/books/add-book`, {
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

  const initialValues: BookFormValues = {
    title: "",
    authors: "",
    description: "",
    isbn: "",
    publishedDate: "",
    categories: [],
    pageCount: undefined,
    averageRating: undefined,
    ratingsCount: undefined,
    thumbnail: "",
    smallThumbnail: ""
  };

  const searchBooks = useCallback(async () => {
    setError("");
    try {
      const response = await fetch(`/api/books/search?title=${uriEncodedTitle}`);
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
  }, [uriEncodedTitle]);

  const onSubmit = async (values: BookFormValues, { resetForm }: { resetForm: () => void }) => {
    console.log("Form data", values);
    setError("");
    setMessage("");

    const { author, authors } = normalizeAuthors(values.authors);

    const payload = {
      title: values.title.trim(),
      author,
      authors,
      isbn: values.isbn.trim(),
      description: values.description.trim(),
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
      const response = await fetch("/api/books/add-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...payload
        }),
        credentials: "include"
      });
      if (response.ok) {
        const responseData = await response.json();
        const addedBook: IBook = responseData.book;
        setBooks([...books, addedBook]);
        setMessage("Book added successfully");
        resetForm();
      } else {
        const errorData = await response.json();
        setError(`Couldn't add book: ${errorData.message || "Please check your input."}`);
      }
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="AddBook flex justify-center">
      <div className="w-full max-w-md bg-white px-6 py-12 rounded-xl shadow-sm">
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
              setSearchTitle(e.target.value);
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
          validationSchema={toFormikValidationSchema(BaseBookSchema)}
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
                name="title"
                required
                className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
              />
              {formik.errors.title && formik.touched.title ? (
                <p className="text-sm text-red-400">
                  {formik.errors.title}
                </p>
              ) : null}
              <label htmlFor="authors">
                Author(s) <span>(comma-separated)</span>:
              </label>
              <Field
                as="input"
                type="text"
                name="authors"
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
                name="isbn"
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
                name="description"
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
                name="publishedDate"
                required
                className="border border-gray-300 text-sm rounded-md w-full dark:border-gray-600 dark:placeholder-gray-400 p-2"
              />
              {formik.errors.publishedDate && formik.touched.publishedDate ? (
                <p className="text-sm text-red-400">
                  {formik.errors.publishedDate}
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
              <button
                type="submit"
                className="text-white w-full sm:w-auto bg-blue-300 hover:bg-blue-400 rounded-md text-center p-2"
                disabled={formik.isSubmitting}
              >
                Add Book Manually
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
    </div>
  );
};

export default AddBook;
