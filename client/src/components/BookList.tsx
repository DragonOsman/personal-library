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
        "https://personal-library-server.onrender.com/api/books/list-books", {
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
    <div className={`book-list container container-fluid d-inline-flex
    justify-content-center align-items-center flex-column
    ${isListVisible ? "scroll-y" : "overflow-hidden"}`}>
      <div className="container-fluid container">
        <div className="row flex-column">
          <div className="col-auto">
            <h2 className="display-4 text-center">Book List</h2>
          </div>
          <div className="col-auto">
            <Link
              to="/books/add-book"
              className="btn btn-outline-warning float-right add-book"
            >
              + Add New Book
            </Link>
            <br />
            <br />
          </div>
        </div>
        <div className="row container-fluid">
          {isListFetched ? (
            <button
              type="button"
              title="show or hide book list"
              className="btn btn-primary show-book-list"
              onClick={toggleVisibility}
            >
              {isListVisible ? "Hide " : "Show "} Book List
            </button>
          ) : (
            <button
              type="button"
              title="fetch book list"
              className="btn btn-primary fetch-book-list"
              onClick={fetchBooks}
            >
              Fetch Book List
            </button>
          )}
          {(isListFetched && isListVisible) && (
            <div
              className={`list ${window.innerWidth >= 700 && bookContext.length >= 3 ? "scroll-y" :
              window.innerWidth < 700 && bookContext.length === 1 ? "" :
              window.innerWidth < 700 && bookContext.length > 1 ? "scroll-y" : ""} list-is-visible
               container-fluid`}
            >
              {bookList}
            </div>
          )}
        </div>
        {error !== "" && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

export default BookList;