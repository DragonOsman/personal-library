import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { BookContext, IBook } from "../context/BookContext";
import { Link } from "react-router-dom";
import BookInfo from "../components/BookInfo";
import "./BookList.css";

const BookList = () => {
  const { userContext, setUserContext } = useContext(UserContext);
  const { bookContext, setBookContext } = useContext(BookContext);

  useEffect(() => {
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
          } catch (err) {
            console.log(`Error getting books data from response: ${err}`);
          }
        }
      } catch (err) {
        console.log(`Error fetching books: ${err}`);
      }
    };

    fetchBooks();
  }, [userContext.token, setBookContext]);

  const bookList = bookContext.length === 0
    ? "No books to show!"
    : bookContext.map((book: IBook, index: number) => <BookInfo {...book} key={index} />)
  ;

  return (
    <div className="book-list container container-fluid">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <br />
            <h2 className="display-4 text-center">Book List</h2>
          </div>
          <div className="col-md-11">
            <Link
              to="/books/add-book"
              className="btn btn-outline-warning float-right"
            >
              + Add New Book
            </Link>
            <br />
            <br />
            <br />
          </div>
        </div>
        <div className="list">{bookList}</div>
      </div>
    </div>
  );
};

export default BookList;