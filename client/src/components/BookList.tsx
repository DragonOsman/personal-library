import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import BookInfo from "../components/BookInfo";
import { BookContext, IBook } from "../context/BookContext";

const BookList = () => {
  const { userContext, setUserContext } = useContext(UserContext);
  const { bookContext, setBookContext } = useContext(BookContext);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksResponse = await fetch(
          `https://personal-library-server.onrender.com/api/books/list-books`, {
            method: "GET",
            credentials: "include",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userContext.token}`
            }
          }
        );

        if (booksResponse.ok) {
          try {
            const booksData: IBook[] = await booksResponse.json();
            setBookContext(booksData);
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

  let bookList;
  try {
    bookList = bookContext.length === 0
    ? "There are no books!"
    : bookContext.map((book: IBook, index: number) => {
      console.log(`Inside bookContext.map callback, book: ${book}, book.book: ${book.book}`);
      return <BookInfo book={book.book} key={index} />;
    })
  ;
  } catch (err) {
    console.log(`In BookList component, when creating bookList object: ${err}`);
  }


  return (
    <div className="ShowBookList">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <br />
            <h2 className="display-4 text-center">Book List</h2>
          </div>
          <div className="col-md-11">
            <Link
              to="/create-book"
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