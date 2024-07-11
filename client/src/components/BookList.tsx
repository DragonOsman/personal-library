import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { BookContext, IBook } from "../context/BookContext";
import { Link } from "react-router-dom";
import BookInfo from "../components/BookInfo";
import "./BookList.css";

const BookList = () => {
  const { userContext, setUserContext } = useContext(UserContext);
  const { bookContext, setBookContext } = useContext(BookContext);

  const [isListVisible, setIsListVisible] = useState(true);
  const [isListFetched, setIsListFetched] = useState(false);
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    try {
      const booksResponse = await fetch(
        "https://personal-library-server.vercel.app/api/books/list-books", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userContext.token}`
          }
        }
      );

      if (booksResponse.ok) {
        try {
          const booksData = await booksResponse.json();
          setBookContext(booksData.books);
          setIsListFetched(true);
        } catch (err) {
          console.log(`Error getting books data from response: ${err}`);
          setError(err as string);
        }
      }
    } catch (err) {
      console.log(`Error fetching books: ${err}`);
      setError(err as string);
    }
  };

  const toggleVisibility = () => {
    setIsListVisible(!isListVisible);
  };

  const bookList = bookContext.length === 0
    ? "No books to show!"
    : bookContext.map((book: IBook, index: number) => <BookInfo {...book} key={index} />
  );

  return (
    <div className="book-list container-fluid row
      d-flex justify-content-center align-items-center">
      <div className="container-fluid col-auto">
        <div className="row container-fluid">
          <h2
            className={`display-4 col-auto list-title
              ${isListFetched && isListVisible ? "list-visible-title" : ""}`}
          >
            Book List
          </h2>
        </div>
        <div className="row container-fluid">
          <div>
            <Link
              to="/books/add-book"
              className={`btn btn-outline-warning add-book
                ${isListFetched && isListVisible ? "list-visible-add" : ""}`}
            >
              + Add New Book
            </Link>
            <br />
            <br />
          </div>
        </div>
        <div className="container-fluid">
          {isListFetched ? (
            <button
              type="button"
              title="show or hide book list"
              className={`btn btn-primary show-book-list
                ${isListFetched && isListVisible ? "list-visible-show" : ""}`}
              onClick={toggleVisibility}
            >
              {isListVisible ? "Hide " : "Show "} Book List
            </button>
          ) : (
            <button
              type="button"
              title="fetch book list"
              className={`btn btn-primary fetch-book-list
                ${isListFetched && isListVisible ? "list-visible-fetch" : ""}`}
              onClick={fetchBooks}
            >
              Fetch Book List
            </button>
          )}
        </div>
        {(isListFetched && isListVisible) && (
          <div
            className="list list-is-visible container-fluid"
          >
            {bookList}
          </div>
        )}
        {error !== "" && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

export default BookList;