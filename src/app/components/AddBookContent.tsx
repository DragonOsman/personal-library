// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

"use client";

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { Formik, Form, Field } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import toast from "react-hot-toast";

import {
  BookContext,
  IBookContext,
  IBook,
  BookFormValues,
  BOOK_CATEGORIES
} from "@/app/context/BookContext";

import { BaseBookSchema } from "@/app/books/BookSchemaZod";
import { BookSearchSchema } from "@/utils/search-validation";

const SEARCH_PAGE_SIZE = 40;

type SearchMode = "pages" | "infinite";

interface GoogleApiImageLinks {
  smallThumbnail?: string;
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
  extraLarge?: string;
}

interface GoogleApiIndustryIdentifier {
  type: string;
  identifier: string;
}

interface GoogleApiVolumeInfo {
  title?: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: GoogleApiIndustryIdentifier[];
  readingModes?: {
    text?: boolean;
    image?: boolean;
  };
  pageCount?: number;
  printType?: string;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  maturityRating?: string;
  allowAnonLogging?: boolean;
  contentVersion?: string;
  panelizationSummary?: {
    containsEpubBubbles?: boolean;
    containsImageBubbles?: boolean;
  };
  imageLinks?: GoogleApiImageLinks;
  language?: string;
  previewLink?: string;
  infoLink?: string;
  canonicalVolumeLink?: string;
}

interface GoogleApiBookItem {
  kind?: string;
  id: string;
  etag?: string;
  selfLink?: string;
  volumeInfo: GoogleApiVolumeInfo;
}

interface SearchResponse {
  kind?: string;
  totalItems: number;
  items: GoogleApiBookItem[];
  startIndex: number;
  endIndex: number | null;
  maxResults: number;
  hasMore: boolean;
}

interface SearchFormValues {
  title: string;
  author: string;
  isbn: string;
  subject: string;
}

const searchInitialValues: SearchFormValues = {
  title: "",
  author: "",
  isbn: "",
  subject: ""
};

const normalizeGoogleBooksImageUrl = (
  imageUrl?: string
): string | undefined => {
  if (!imageUrl) {
    return undefined;
  }

  return imageUrl.replace(
    /^http:\/\//i,
    "https://"
  );
};

const getIsbn = (
  item: GoogleApiBookItem
): string | undefined => {
  const identifiers =
    item.volumeInfo.industryIdentifiers;

  if (!identifiers) {
    return undefined;
  }

  const isbn13 = identifiers.find(
    (identifier) => identifier.type === "ISBN_13"
  );

  if (isbn13) {
    return isbn13.identifier;
  }

  const isbn10 = identifiers.find(
    (identifier) => identifier.type === "ISBN_10"
  );

  return isbn10?.identifier;
};

export default function AddBookContent() {
  const { books, setBooks } =
    useContext<IBookContext>(BookContext);

  const [searchResults, setSearchResults] = useState<
    GoogleApiBookItem[]
  >([]);

  const [searchCriteria, setSearchCriteria] =
    useState<SearchFormValues | null>(null);

  const [searchMode, setSearchMode] =
    useState<SearchMode>("pages");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [searchMeta, setSearchMeta] =
    useState<SearchResponse>({
      totalItems: 0,
      items: [],
      startIndex: 0,
      endIndex: null,
      maxResults: SEARCH_PAGE_SIZE,
      hasMore: false
    });

  const [isSearching, setIsSearching] =
    useState(false);

  const [isLoadingMore, setIsLoadingMore] =
    useState(false);

  const loadMoreRef =
    useRef<HTMLDivElement | null>(null);

  const loadingMoreRef =
    useRef(false);

  /*
   * Build the query parameters used by our
   * /api/books/search route.
   */
  const buildSearchParams = useCallback(
    (
      values: SearchFormValues,
      startIndex: number
    ) => {
      const params = new URLSearchParams();

      if (values.title.trim()) {
        params.set(
          "title",
          values.title.trim()
        );
      }

      if (values.author.trim()) {
        params.set(
          "author",
          values.author.trim()
        );
      }

      if (values.isbn.trim()) {
        params.set(
          "isbn",
          values.isbn.trim()
        );
      }

      if (values.subject.trim()) {
        params.set(
          "subject",
          values.subject.trim()
        );
      }

      params.set(
        "startIndex",
        startIndex.toString()
      );

      params.set(
        "maxResults",
        SEARCH_PAGE_SIZE.toString()
      );

      return params;
    },
    []
  );

  /*
   * Fetch one page of Google Books results.
   *
   * append = false:
   *   Replace the current results.
   *
   * append = true:
   *   Append the new results to the existing results.
   */
  const fetchSearchResults = useCallback(
    async (
      values: SearchFormValues,
      startIndex: number,
      append: boolean
    ): Promise<SearchResponse | null> => {
      const params = buildSearchParams(
        values,
        startIndex
      );

      const url = `/api/books/search?${params.toString()}`;

      console.log(
        "Requesting book search:",
        url
      );

      const response = await fetch(url);

      if (!response.ok) {
        let message = "Failed to search for books.";

        try {
          const errorData = await response.json();

          if (typeof errorData.message === "string") {
            message = errorData.message;
          }
        } catch {
          // Ignore JSON parsing errors.
        }

        throw new Error(message);
      }

      const data =
        (await response.json()) as SearchResponse;

      const newItems = data.items ?? [];

      if (append) {
        setSearchResults((previousResults) => {
          /*
           * Google Books normally provides unique IDs,
           * but de-duplicate defensively in case a result
           * appears in two requests.
           */
          const existingIds = new Set(previousResults.map((item) => item.id));

          const uniqueNewItems = newItems.filter((item) => !existingIds.has(item.id));

          return [
            ...previousResults,
            ...uniqueNewItems
          ];
        });
      } else {
        setSearchResults(newItems);
      }

      setSearchMeta(data);

      return data;
    },
    [buildSearchParams]
  );

  /*
   * Start a completely new search.
   */
  const searchBooks = useCallback(
    async (values: SearchFormValues) => {
      setIsSearching(true);

      try {
        setSearchCriteria(values);
        setCurrentPage(1);

        await fetchSearchResults(
          values,
          0,
          false
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to search for books.";

        console.error(
          "Book search failed:",
          error
        );

        toast.error(message);

        setSearchResults([]);
        setSearchMeta({
          totalItems: 0,
          items: [],
          startIndex: 0,
          endIndex: null,
          maxResults: SEARCH_PAGE_SIZE,
          hasMore: false
        });
      } finally {
        setIsSearching(false);
      }
    },
    [fetchSearchResults]
  );

  /*
   * Load the next batch for infinite scrolling.
   */
  const loadMoreResults = useCallback(
    async () => {
      if (
        !searchCriteria ||
        !searchMeta.hasMore ||
        loadingMoreRef.current
      ) {
        return;
      }

      loadingMoreRef.current = true;
      setIsLoadingMore(true);

      try {
        /*
         * The next startIndex is the number of
         * results we've already loaded.
         *
         * For example:
         *
         * 0-39 loaded -> next request starts at 40
         * 0-79 loaded -> next request starts at 80
         */
        const nextStartIndex =
          searchResults.length;

        await fetchSearchResults(
          searchCriteria,
          nextStartIndex,
          true
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load more books.";

        console.error(
          "Failed to load more books:",
          error
        );

        toast.error(message);
      } finally {
        loadingMoreRef.current = false;
        setIsLoadingMore(false);
      }
    },
    [
      fetchSearchResults,
      searchCriteria,
      searchMeta.hasMore,
      searchResults.length
    ]
  );

  /*
   * Infinite-scroll observer.
   *
   * The sentinel is placed below the result cards.
   * We start loading the next page before the user
   * actually reaches the bottom.
   */
  useEffect(() => {
    if (
      searchMode !== "infinite" ||
      !searchCriteria ||
      !searchMeta.hasMore
    ) {
      return;
    }

    const element =
      loadMoreRef.current;

    if (!element) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const firstEntry =
            entries[0];

          if (
            firstEntry?.isIntersecting &&
            !loadingMoreRef.current
          ) {
            void loadMoreResults();
          }
        },
        {
          rootMargin: "400px"
        }
      );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [
    loadMoreResults,
    searchCriteria,
    searchMeta.hasMore,
    searchMode
  ]);

  /*
   * Fetch a specific page in pagination mode.
   */
  const goToPage = useCallback(
    async (page: number) => {
      if (!searchCriteria) {
        return;
      }

      const totalPages = Math.max(
        1,
        Math.ceil(
          searchMeta.totalItems /
            SEARCH_PAGE_SIZE
        )
      );

      if (
        page < 1 ||
        page > totalPages ||
        page === currentPage
      ) {
        return;
      }

      setIsSearching(true);

      try {
        const startIndex =
          (page - 1) *
          SEARCH_PAGE_SIZE;

        await fetchSearchResults(
          searchCriteria,
          startIndex,
          false
        );

        setCurrentPage(page);

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load this page.";

        console.error(
          "Pagination request failed:",
          error
        );

        toast.error(message);
      } finally {
        setIsSearching(false);
      }
    },
    [
      currentPage,
      fetchSearchResults,
      searchCriteria,
      searchMeta.totalItems
    ]
  );

  /*
   * Switch between pagination and infinite scrolling.
   *
   * We deliberately start the new mode from the
   * beginning of the search rather than trying to
   * translate an already-loaded result set between
   * the two modes.
   */
  const changeSearchMode = useCallback(
    async (mode: SearchMode) => {
      if (mode === searchMode) {
        return;
      }

      setSearchMode(mode);

      if (!searchCriteria) {
        return;
      }

      setIsSearching(true);

      try {
        setCurrentPage(1);

        await fetchSearchResults(
          searchCriteria,
          0,
          false
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to change search mode.";

        console.error(
          "Failed to change search mode:",
          error
        );

        toast.error(message);
      } finally {
        setIsSearching(false);
      }
    },
    [
      fetchSearchResults,
      searchCriteria,
      searchMode
    ]
  );

  /*
   * Number of pages for normal pagination.
   */
  const totalPages = useMemo(
    () =>
      Math.max(
        1,
        Math.ceil(
          searchMeta.totalItems /
            SEARCH_PAGE_SIZE
        )
      ),
    [searchMeta.totalItems]
  );

  /*
   * Add a book returned by Google Books.
   */
  const handleAddBookFromSearch =
    useCallback(
      async (item: GoogleApiBookItem) => {
        const volumeInfo =
          item.volumeInfo;

        const isbn = getIsbn(item);

        const alreadyExists =
          isbn &&
          books.some(
            (book) =>
              book.isbn === isbn
          );

        if (alreadyExists) {
          toast.error(
            "This book is already in your library."
          );

          return;
        }

        const imageLinks =
          volumeInfo.imageLinks
            ? {
                thumbnail:
                  normalizeGoogleBooksImageUrl(
                    volumeInfo.imageLinks
                      .thumbnail
                  ),
                smallThumbnail:
                  normalizeGoogleBooksImageUrl(
                    volumeInfo.imageLinks
                      .smallThumbnail
                  )
              }
            : undefined;

        const bookData: Partial<IBook> = {
          title:
            volumeInfo.title ?? "",
          authors:
            volumeInfo.authors ?? [],
          publishedDate:
            volumeInfo.publishedDate,
          isbn,
          description:
            volumeInfo.description,
          pageCount:
            volumeInfo.pageCount,
          categories:
            volumeInfo.categories,
          imageLinks,
          language:
            volumeInfo.language,
          averageRating:
            volumeInfo.averageRating,
          ratingsCount:
            volumeInfo.ratingsCount
        };

        const confirmed =
          window.confirm(
            `Add "${volumeInfo.title ?? "this book"}" to your library?`
          );

        if (!confirmed) {
          return;
        }

        try {
          const response =
            await fetch(
              "/api/books/add-book",
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json"
                },
                body: JSON.stringify(
                  bookData
                )
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ??
                "Failed to add book."
            );
          }

          const addedBook =
            data.book;

          setBooks([
            ...books,
            addedBook
          ]);

          toast.success(
            "Book added to your library."
          );
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to add book.";

          console.error(
            "Failed to add book:",
            error
          );

          toast.error(message);
        }
      },
      [books, setBooks]
    );

  return (
    <div className="space-y-8">
      {/* Search form */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">
          Search Google Books
        </h2>

        <Formik
          initialValues={searchInitialValues}
          onSubmit={async (values) => {
            await searchBooks(values);
          }}
          validationSchema={toFormikValidationSchema(
            BookSearchSchema
          )}
        >
          {({
            errors,
            touched,
            isSubmitting
          }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="mb-1 block font-medium"
                  >
                    Title
                  </label>

                  <Field
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Book title"
                    className="w-full rounded border px-3 py-2"
                  />

                  {touched.title &&
                    errors.title && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.title}
                      </p>
                    )}
                </div>

                {/* Author */}
                <div>
                  <label
                    htmlFor="author"
                    className="mb-1 block font-medium"
                  >
                    Author
                  </label>

                  <Field
                    id="author"
                    name="author"
                    type="text"
                    placeholder="Author name"
                    className="w-full rounded border px-3 py-2"
                  />

                  {touched.author &&
                    errors.author && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.author}
                      </p>
                    )}
                </div>

                {/* ISBN */}
                <div>
                  <label
                    htmlFor="isbn"
                    className="mb-1 block font-medium"
                  >
                    ISBN
                  </label>

                  <Field
                    id="isbn"
                    name="isbn"
                    type="text"
                    placeholder="ISBN-10 or ISBN-13"
                    className="w-full rounded border px-3 py-2"
                  />

                  {touched.isbn &&
                    errors.isbn && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.isbn}
                      </p>
                    )}
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-1 block font-medium"
                  >
                    Subject
                  </label>

                  <Field
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Subject"
                    className="w-full rounded border px-3 py-2"
                  />

                  {touched.subject &&
                    errors.subject && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.subject}
                      </p>
                    )}
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  isSearching
                }
                className="rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSearching
                  ? "Searching..."
                  : "Search Books"}
              </button>
            </Form>
          )}
        </Formik>
      </section>

      {/* Search mode */}
      {searchCriteria && (
        <section>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Search Results
              </h2>

              <p className="text-sm text-gray-600">
                {searchMeta.totalItems.toLocaleString()}{" "}
                results found
              </p>
            </div>

            <div className="flex rounded border">
              <button
                type="button"
                onClick={() =>
                  void changeSearchMode(
                    "pages"
                  )
                }
                disabled={isSearching}
                className={`px-4 py-2 ${
                  searchMode === "pages"
                    ? "bg-gray-200 font-semibold"
                    : ""
                }`}
              >
                Pages
              </button>

              <button
                type="button"
                onClick={() =>
                  void changeSearchMode(
                    "infinite"
                  )
                }
                disabled={isSearching}
                className={`border-l px-4 py-2 ${
                  searchMode === "infinite"
                    ? "bg-gray-200 font-semibold"
                    : ""
                }`}
              >
                Infinite Scroll
              </button>
            </div>
          </div>

          {/* Result range */}
          {searchMeta.endIndex !==
            null && (
            <p className="mb-4 text-sm text-gray-600">
              Showing{" "}
              {(
                searchMeta.startIndex + 1
              ).toLocaleString()}{" "}
              –{" "}
              {(
                searchMeta.endIndex + 1
              ).toLocaleString()}{" "}
              of{" "}
              {searchMeta.totalItems.toLocaleString()}
            </p>
          )}

          {/* Results */}
          {searchResults.length ===
          0 ? (
            <div className="rounded border p-6 text-center">
              {isSearching
                ? "Searching..."
                : "No books found."}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map(
                (item) => {
                  const volumeInfo =
                    item.volumeInfo;

                  const imageUrl =
                    normalizeGoogleBooksImageUrl(
                      volumeInfo
                        .imageLinks
                        ?.thumbnail ??
                        volumeInfo
                          .imageLinks
                          ?.smallThumbnail
                    );

                  const isbn =
                    getIsbn(item);

                  return (
                    <article
                      key={item.id}
                      className="flex gap-4 rounded-lg border p-4"
                    >
                      <div className="w-24 shrink-0">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={
                              volumeInfo.title ??
                              "Book cover"
                            }
                            className="h-36 w-24 object-cover"
                          />
                        ) : (
                          <div className="flex h-36 w-24 items-center justify-center bg-gray-100 text-center text-xs text-gray-500">
                            No cover
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold">
                          {volumeInfo.title ??
                            "Untitled"}
                        </h3>

                        {volumeInfo.authors
                          ?.length ? (
                          <p className="mt-1 text-sm text-gray-600">
                            {volumeInfo.authors.join(
                              ", "
                            )}
                          </p>
                        ) : null}

                        {volumeInfo.publishedDate ? (
                          <p className="mt-1 text-sm text-gray-500">
                            {
                              volumeInfo.publishedDate
                            }
                          </p>
                        ) : null}

                        {isbn ? (
                          <p className="mt-1 text-xs text-gray-500">
                            ISBN: {isbn}
                          </p>
                        ) : null}

                        {volumeInfo
                          .averageRating !==
                          undefined ? (
                          <p className="mt-1 text-sm">
                            ★{" "}
                            {
                              volumeInfo.averageRating
                            }
                            {volumeInfo
                              .ratingsCount
                              ? ` (${volumeInfo.ratingsCount})`
                              : ""}
                          </p>
                        ) : null}

                        <button
                          type="button"
                          onClick={() =>
                            void handleAddBookFromSearch(
                              item
                            )
                          }
                          className="mt-3 rounded bg-green-600 px-3 py-2 text-sm font-medium text-white"
                        >
                          Add Book
                        </button>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}

          {/* Pagination controls */}
          {searchMode ===
            "pages" &&
            totalPages > 1 && (
              <nav
                className="mt-8 flex items-center justify-center gap-2"
                aria-label="Book search pagination"
              >
                <button
                  type="button"
                  disabled={
                    currentPage === 1 ||
                    isSearching
                  }
                  onClick={() =>
                    void goToPage(
                      currentPage - 1
                    )
                  }
                  className="rounded border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="px-3 py-2 text-sm">
                  Page{" "}
                  <strong>
                    {currentPage}
                  </strong>{" "}
                  of{" "}
                  <strong>
                    {totalPages}
                  </strong>
                </span>

                <button
                  type="button"
                  disabled={
                    currentPage ===
                      totalPages ||
                    isSearching
                  }
                  onClick={() =>
                    void goToPage(
                      currentPage + 1
                    )
                  }
                  className="rounded border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </nav>
            )}

          {/* Infinite-scroll sentinel */}
          {searchMode ===
            "infinite" && (
            <div
              ref={loadMoreRef}
              className="mt-8 flex min-h-16 items-center justify-center"
            >
              {isLoadingMore ? (
                <p className="text-sm text-gray-600">
                  Loading more books...
                </p>
              ) : searchMeta.hasMore ? (
                <p className="text-sm text-gray-500">
                  Scroll down to load more.
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  You've reached the end of
                  the search results.
                </p>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}