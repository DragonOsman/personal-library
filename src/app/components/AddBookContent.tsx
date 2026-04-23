// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

"use client";

import { useState, useContext, useCallback, FormEvent } from "react";
import {
  BookContext,
  IBook,
  BookFormValues,
  BOOK_CATEGORIES
} from "@/src/app/context/BookContext";
import { BaseBookSchema } from "@/src/app/books/BookSchemaZod";
import { Formik, Form, Field } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import toast from "react-hot-toast";

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

const AddBookPageContent = () => {
  const [searchTitle, setSearchTitle] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { books, setBooks } = useContext(BookContext);
  const [searchResults, setSearchResults] = useState<GoogleApiBookItem[]>([]);
  const [search, setSearch] = useState("");
  const [showManualAddingForm, setShowManualAddingForm] = useState(false);

  const uriEncodedTitle = encodeURIComponent(searchTitle);

  const normalizeAuthors = (input: string) => {
    const parts = input
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    return {
      author: parts[0],
      authors: parts.length > 1 ? parts : []
    };
  };

  const handleAddBookFromSearch = async (item: GoogleApiBookItem) => {
    if (window.confirm("Do you want to add this book to your library?")) {
      const bookToAdd: Partial<IBook> = {
        id: item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors?.[0],
        authors: item.volumeInfo.authors,
        publishedDate: item.volumeInfo.publishedDate || Date.now().toString(),
        description: item.volumeInfo.description,
        isbn: item.volumeInfo.industryIdentifiers?.find(
          (id) => id.type === "ISBN_13" || id.type === "ISBN_10"
        )?.identifier,
        pageCount: item.volumeInfo.pageCount,
        categories: item.volumeInfo.categories,
        imageLinks: {
          thumbnail: item?.volumeInfo.imageLinks?.thumbnail,
          smallThumbnail: item?.volumeInfo.imageLinks?.smallThumbnail
        },
        language: item.volumeInfo.language,
        averageRating: item?.volumeInfo.averageRating,
        ratingsCount: item?.volumeInfo.ratingsCount
      };

      const bookExists = books.some((b) => b.isbn === bookToAdd.isbn);

      if (bookExists) {
        setError("This book is already in your library.");
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
          setSearchResults([]);
        } else {
          const errorData = await response.json();
          setError(
            `Failed to add book: ${
              errorData.message || response.statusText
            }`
          );
        }
      } catch (err) {
        console.error("Error adding book from search:", err);
        setError(
          `An error occurred: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
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
      const response = await fetch(
        `/api/books/search?title=${uriEncodedTitle}`
      );

      if (response.ok) {
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          setSearchResults(data.items);
        } else {
          setSearchResults([]);
          setSearchTitle("");
          setError("No books found matching your search criteria.");
        }
      }
    } catch (err) {
      console.error(
        `An error occurred while searching for books: ${err}`
      );
      setError(
        `An error occurred while searching for books: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }, [uriEncodedTitle]);

  const onSubmit = async (
    values: BookFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        setError(
          `Couldn't add book: ${
            errorData.message || "Please check your input."
          }`
        );
      }
    } catch (err) {
      setError(
        `An error occurred: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  };

  return (
    <div className="AddBook flex justify-center">
      <div className="w-full max-w-md bg-white px-6 py-12 rounded-xl shadow-sm">
        <h1 className="text-black">Add a New Book</h1>

        {/* Search Form */}
        <form
          onSubmit={async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            await searchBooks();
          }}
          className="searchBooks"
        >
          <label htmlFor="search">Search for a book:</label>

          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search books..."
              className="input input-bordered w-full max-w-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <input
            type="submit"
            value="Search"
            className="text-white w-full sm:w-auto bg-blue-300 hover:bg-blue-400 rounded-md text-center p-2"
          />
        </form>

        {error && <p className="text-error text-sm">{toast.error(error)}</p>}

        {/* Toggle Manual Form */}
        <button
          type="button"
          onClick={() =>
            setShowManualAddingForm(!showManualAddingForm)
          }
          className="btn btn-primary w-full mt-4"
        >
          {`${showManualAddingForm ? "Hide" : "Show"} Manual Book Entry Form`}
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
              <Form className="space-y-4">
                <div className="form-control">
                  <label htmlFor="title" className="label">
                    <span className="label-text">Title:</span>
                  </label>
                  <Field
                    as="input"
                    type="text"
                    name="title"
                    required
                    className="input input-bordered w-full"
                  />
                  {formik.errors.title && formik.touched.title && (
                    <p className="text-error text-sm">{toast.error(formik.errors.title)}</p>
                  )}
                </div>

                <div className="form-control">
                  <label htmlFor="authors" className="label">
                    <span className="label-text">Authors <span className="text-xs text-gray-500">
                      (comma-separated):
                    </span></span>
                  </label>
                  <Field
                    as="input"
                    type="text"
                    name="authors"
                    required
                    className="input input-bordered w-full"
                  />
                  {formik.errors.authors && formik.touched.authors && (
                    <p className="text-error text-sm">{toast.error(formik.errors.authors)}</p>
                  )}
                </div>

                <div className="form-control">
                  <label htmlFor="isbn" className="label">
                    <span className="label-text">ISBN:</span>
                  </label>
                  <Field
                    as="input"
                    type="text"
                    name="isbn"
                    required
                    className="input input-bordered w-full"
                  />
                  {formik.errors.isbn && formik.touched.isbn && (
                    <p className="text-error text-sm">{toast.error(formik.errors.isbn)}</p>
                  )}
                </div>

                <div className="form-control">
                  <label htmlFor="description" className="label">
                    <span className="label-text">Description:</span>
                  </label>
                  <Field
                    as="textarea"
                    rows={4}
                    name="description"
                    required
                    className="textarea textarea-bordered w-full"
                  />
                  {formik.errors.description && formik.touched.description && (
                    <p className="text-error text-sm">
                      {toast.error(formik.errors.description)}
                    </p>
                  )}
                </div>

                <div className="form-control">
                  <label htmlFor="publishedDate" className="label">
                    <span className="label-text">Publication Date:</span>
                  </label>
                  <Field
                    as="input"
                    type="text"
                    name="publishedDate"
                    required
                    className="input input-bordered w-full"
                  />
                  {formik.errors.publishedDate && formik.touched.publishedDate && (
                    <p className="text-error text-sm">
                      {toast.error(formik.errors.publishedDate)}
                    </p>
                  )}
                </div>

                <div className="form-control">
                  <label htmlFor="categories" className="label">
                    <span className="label-text">Categories (select at least one):</span>
                  </label>
                  <Field
                    as="select"
                    name="categories"
                    multiple
                    className="select select-bordered w-full h-32"
                  >
                    {BOOK_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Field>
                </div>

                <div className="form-control">
                  <label htmlFor="pageCount" className="label">
                    <span className="label-text">Page Count:</span>
                  </label>
                  <Field
                    as="input"
                    type="number"
                    name="pageCount"
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control">
                  <label htmlFor="averageRating" className="label">
                    <span className="label-text">Average Rating:</span>
                  </label>
                  <Field
                    as="input"
                    type="number"
                    name="averageRating"
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control">
                  <label htmlFor="ratingsCount" className="label">
                    <span className="label-text">Ratings Count:</span>
                  </label>
                  <Field
                    as="input"
                    type="number"
                    name="ratingsCount"
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control">
                  <label htmlFor="thumbnail" className="label">
                    <span className="label-text">Thumbnail URL:</span>
                  </label>
                  <Field
                    as="input"
                    type="text"
                    name="thumbnail"
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control">
                  <label htmlFor="smallThumbnail" className="label">
                    <span className="label-text">Small Thumbnail URL:</span>
                  </label>
                  <Field
                    as="input"
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

                {error && <p className="text-error text-sm">{toast.error(error)}</p>}
                {message && <p className="text-sm">{toast.success(message)}</p>}
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
                const img = result.volumeInfo.imageLinks?.thumbnail;

                return (
                  <div
                    key={index}
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
                        {result.volumeInfo.authors?.join(", ") ||
                          "Unknown Author"}
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