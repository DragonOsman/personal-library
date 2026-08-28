// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

"use client";

import { useState, useContext, useCallback } from "react";
import {
  BookContext,
  IBook,
  BookFormValues,
  BOOK_CATEGORIES
} from "@/app/context/BookContext";
import { BaseBookSchema } from "@/app/books/BookSchemaZod";
import { BookSearchSchema } from "@/utils/search-validation";
import { Formik, Form, Field } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import toast from "react-hot-toast";

interface GoogleApiVolumeInfo {
  title: string;
  authors?: string[];
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: Array<{
    type: string;
    identifier: string;
  }>;
  pageCount?: number;
  categories?: string[];
  imageLinks?: {
    thumbnail?: string;
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

interface SearchFormValues {
  title: string;
  author: string;
  isbn: string;
  subject: string;
}

const AddBookPageContent = () => {
  const { books, setBooks } = useContext(BookContext);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [searchResults, setSearchResults] = useState<
    GoogleApiBookItem[]
  >([]);

  const [showManualAddingForm, setShowManualAddingForm] =
    useState(false);

  const normalizeAuthors = (input: string) => {
    const parts = input
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    return {
      author: parts[0] || "",
      authors: parts.length > 1 ? parts : parts.length === 1 ? parts : []
    };
  };

  const handleAddBookFromSearch = async (
    item: GoogleApiBookItem
  ) => {
    if (!window.confirm("Do you want to add this book to your library?")) {
      return;
    }

    const bookToAdd: Partial<IBook> = {
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0],
      authors: item.volumeInfo.authors,
      publishedDate:
        item.volumeInfo.publishedDate || new Date().toISOString(),
      description: item.volumeInfo.description,
      isbn: item.volumeInfo.industryIdentifiers?.find(
        (identifier) =>
          identifier.type === "ISBN_13" ||
          identifier.type === "ISBN_10"
      )?.identifier,
      pageCount: item.volumeInfo.pageCount,
      categories: item.volumeInfo.categories,
      imageLinks: {
        thumbnail: item.volumeInfo.imageLinks?.thumbnail,
        smallThumbnail: item.volumeInfo.imageLinks?.smallThumbnail
      },
      language: item.volumeInfo.language,
      averageRating: item.volumeInfo.averageRating,
      ratingsCount: item.volumeInfo.ratingsCount
    };

    const bookExists = books.some(
      (book) => book.isbn === bookToAdd.isbn
    );

    if (bookExists) {
      setError("This book is already in your library.");
      return;
    }

    try {
      const response = await fetch("/api/books/add-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(bookToAdd)
      });

      if (!response.ok) {
        const errorData = await response.json();

        setError(
          `Failed to add book: ${
            errorData.message || response.statusText
          }`
        );

        return;
      }

      const responseData = await response.json();
      const addedBook: IBook = responseData.book;

      setBooks([...books, addedBook]);
      setMessage("Book added to library successfully!");
      setSearchResults([]);

      toast.success("Book added to library successfully!");
    } catch (error) {
      console.error("Error adding book from search:", error);

      setError(
        `An error occurred: ${
          error instanceof Error
            ? error.message
            : String(error)
        }`
      );

      toast.error(`An error occurred: ${
        error instanceof Error ? error.message : String(error)
      }`);
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

  const searchInitialValues: SearchFormValues = {
    title: "",
    author: "",
    isbn: "",
    subject: ""
  };

  const searchBooks = useCallback(
    async (values: SearchFormValues) => {
      setError("");
      setMessage("");
      setSearchResults([]);

      const searchParams = new URLSearchParams();

      const title = values.title.trim();
      const author = values.author.trim();
      const isbn = values.isbn.trim();
      const subject = values.subject.trim();

      if (title) {
        searchParams.set("title", title);
      }

      if (author) {
        searchParams.set("author", author);
      }

      if (isbn) {
        searchParams.set("isbn", isbn);
      }

      if (subject) {
        searchParams.set("subject", subject);
      }

      if (searchParams.size === 0) {
        setError("Please enter at least one search criterion.");
        return;
      }

      try {
        const response = await fetch(
          `/api/books/search?${searchParams.toString()}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Failed to search for books."
          );
          return;
        }

        if (!data.items || data.items.length === 0) {
          setError(
            "No books found matching your search criteria."
          );
          return;
        }

        setSearchResults(data.items);
      } catch (error) {
        console.error(
          "An error occurred while searching for books:",
          error
        );

        setError(
          `An error occurred while searching for books: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        );
      }
    },
    []
  );

  const onSubmit = async (
    values: BookFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    setError("");
    setMessage("");

    const { author, authors } = normalizeAuthors(
      values.authors
    );

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
        thumbnail: values.thumbnail?.trim() || "",
        smallThumbnail: values.smallThumbnail?.trim() || ""
      }
    };

    try {
      const response = await fetch("/api/books/add-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();

        setError(
          `Couldn't add book: ${
            errorData.message ||
            "Please check your input."
          }`
        );

        return;
      }

      const responseData = await response.json();
      const addedBook: IBook = responseData.book;

      setBooks([...books, addedBook]);
      setMessage("Book added successfully");
      resetForm();
    } catch (error) {
      setError(
        `An error occurred: ${
          error instanceof Error
            ? error.message
            : String(error)
        }`
      );
    }
  };

  return (
    <div className="AddBook flex justify-center">
      <div className="w-full max-w-md bg-white px-6 py-12 rounded-xl shadow-sm">
        <h1 className="text-black">Add a New Book</h1>

        {/* Search Form */}
        <Formik
          initialValues={searchInitialValues}
          onSubmit={async (values) => {
            await searchBooks(values);
          }}
          validationSchema={toFormikValidationSchema(BookSearchSchema)}
        >
          {(formik) => (
            <Form className="space-y-4">
              <h2 className="text-xl font-semibold">
                Search for a Book
              </h2>

              <div className="form-control">
                <label
                  htmlFor="search-title"
                  className="label"
                >
                  <span className="label-text">
                    Title
                  </span>
                </label>

                <Field
                  id="search-title"
                  type="text"
                  name="title"
                  placeholder="Book Title"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label
                  htmlFor="search-author"
                  className="label"
                >
                  <span className="label-text">
                    Author
                  </span>
                </label>

                <Field
                  id="search-author"
                  type="text"
                  name="author"
                  placeholder="Book Author(s)"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label
                  htmlFor="search-isbn"
                  className="label"
                >
                  <span className="label-text">
                    ISBN
                  </span>
                </label>

                <Field
                  id="search-isbn"
                  type="text"
                  name="isbn"
                  placeholder="Book ISBN"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label
                  htmlFor="search-subject"
                  className="label"
                >
                  <span className="label-text">
                    Subject
                  </span>
                </label>

                <Field
                  id="search-subject"
                  type="text"
                  name="subject"
                  placeholder="Book Subject"
                  className="input input-bordered w-full"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting
                  ? "Searching..."
                  : "Search"}
              </button>
            </Form>
          )}
        </Formik>

        {error && (
          <div className="alert alert-error mt-4">
            {error}
          </div>
        )}

        {message && (
          <div className="alert alert-success mt-4">
            {message}
          </div>
        )}

        {/* Toggle Manual Form */}
        <button
          type="button"
          onClick={() =>
            setShowManualAddingForm((previous) => !previous)
          }
          className="btn btn-primary w-full mt-4"
        >
          {showManualAddingForm
            ? "Hide Manual Book Entry Form"
            : "Show Manual Book Entry Form"}
        </button>

        {/* Manual Form */}
        {showManualAddingForm && (
          <Formik
            initialValues={initialValues}
            validationSchema={toFormikValidationSchema(
              BaseBookSchema
            )}
            onSubmit={onSubmit}
          >
            {(formik) => (
              <Form className="space-y-4 mt-6">
                <div className="form-control">
                  <label
                    htmlFor="title"
                    className="label"
                  >
                    <span className="label-text">
                      Title:
                    </span>
                  </label>

                  <Field
                    id="title"
                    type="text"
                    name="title"
                    required
                    className="input input-bordered w-full"
                  />

                  {formik.errors.title &&
                    formik.touched.title && (
                      <p className="text-error text-sm">
                        {formik.errors.title}
                      </p>
                    )}
                </div>

                <div className="form-control">
                  <label
                    htmlFor="authors"
                    className="label"
                  >
                    <span className="label-text">
                      Authors{" "}
                      <span className="text-xs text-gray-500">
                        (comma-separated):
                      </span>
                    </span>
                  </label>

                  <Field
                    id="authors"
                    type="text"
                    name="authors"
                    required
                    className="input input-bordered w-full"
                  />

                  {formik.errors.authors &&
                    formik.touched.authors && (
                      <p className="text-error text-sm">
                        {formik.errors.authors}
                      </p>
                    )}
                </div>

                <div className="form-control">
                  <label
                    htmlFor="isbn"
                    className="label"
                  >
                    <span className="label-text">
                      ISBN:
                    </span>
                  </label>

                  <Field
                    id="isbn"
                    type="text"
                    name="isbn"
                    required
                    className="input input-bordered w-full"
                  />

                  {formik.errors.isbn &&
                    formik.touched.isbn && (
                      <p className="text-error text-sm">
                        {formik.errors.isbn}
                      </p>
                    )}
                </div>

                <div className="form-control">
                  <label
                    htmlFor="description"
                    className="label"
                  >
                    <span className="label-text">
                      Description:
                    </span>
                  </label>

                  <Field
                    as="textarea"
                    id="description"
                    rows={4}
                    name="description"
                    required
                    className="textarea textarea-bordered w-full"
                  />

                  {formik.errors.description &&
                    formik.touched.description && (
                      <p className="text-error text-sm">
                        {formik.errors.description}
                      </p>
                    )}
                </div>

                <div className="form-control">
                  <label
                    htmlFor="publishedDate"
                    className="label"
                  >
                    <span className="label-text">
                      Publication Date:
                    </span>
                  </label>

                  <Field
                    id="publishedDate"
                    type="text"
                    name="publishedDate"
                    required
                    className="input input-bordered w-full"
                  />

                  {formik.errors.publishedDate &&
                    formik.touched.publishedDate && (
                      <p className="text-error text-sm">
                        {formik.errors.publishedDate}
                      </p>
                    )}
                </div>

                <div className="form-control">
                  <label
                    htmlFor="categories"
                    className="label"
                  >
                    <span className="label-text">
                      Categories (select at least one):
                    </span>
                  </label>

                  <Field
                    as="select"
                    id="categories"
                    name="categories"
                    multiple
                    className="select select-bordered w-full h-32"
                  >
                    {BOOK_CATEGORIES.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </Field>
                </div>

                <div className="form-control">
                  <label
                    htmlFor="pageCount"
                    className="label"
                  >
                    <span className="label-text">
                      Page Count:
                    </span>
                  </label>

                  <Field
                    id="pageCount"
                    type="number"
                    name="pageCount"
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control">
                  <label
                    htmlFor="averageRating"
                    className="label"
                  >
                    <span className="label-text">
                      Average Rating:
                    </span>
                  </label>

                  <Field
                    id="averageRating"
                    type="number"
                    name="averageRating"
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control">
                  <label
                    htmlFor="ratingsCount"
                    className="label"
                  >
                    <span className="label-text">
                      Ratings Count:
                    </span>
                  </label>

                  <Field
                    id="ratingsCount"
                    type="number"
                    name="ratingsCount"
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control">
                  <label
                    htmlFor="thumbnail"
                    className="label"
                  >
                    <span className="label-text">
                      Thumbnail URL:
                    </span>
                  </label>

                  <Field
                    id="thumbnail"
                    type="text"
                    name="thumbnail"
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control">
                  <label
                    htmlFor="smallThumbnail"
                    className="label"
                  >
                    <span className="label-text">
                      Small Thumbnail URL:
                    </span>
                  </label>

                  <Field
                    id="smallThumbnail"
                    type="text"
                    name="smallThumbnail"
                    className="input input-bordered w-full"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="btn btn-primary w-full"
                >
                  Add Book Manually
                </button>
              </Form>
            )}
          </Formik>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold text-center">
              Search Results
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {searchResults.map((result, index) => {
                const img =
                  result.volumeInfo.imageLinks
                    ?.thumbnail;

                return (
                  <div
                    key={result.id ?? index}
                    className="card bg-base-100 shadow-md"
                  >
                    <figure className="px-4 pt-4">
                      {img && (
                        <img
                          src={img}
                          alt={result.volumeInfo.title}
                          className="rounded h-40 object-contain"
                        />
                      )}
                    </figure>

                    <div className="card-body text-center">
                      <h3 className="font-semibold line-clamp-2">
                        {result.volumeInfo.title}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {result.volumeInfo.authors?.join(
                          ", "
                        ) || "Unknown Author"}
                      </p>

                      <button
                        onClick={() =>
                          handleAddBookFromSearch(result)
                        }
                        className="btn btn-primary btn-sm mt-2"
                        type="button"
                      >
                        Add Book
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBookPageContent;