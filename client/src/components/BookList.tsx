import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { IBook } from "../IBook";
import { Link } from "react-router-dom";
import BookInfo from "../components/BookInfo";

const BookList = () => {
  const { userContext, setUserContext } = useContext(UserContext);
  const [books, setBooks] = useState<IBook[]>([{
    _id: "",
    title: "",
    isbn: "",
    author: "",
    description: "",
    published_date: "",
    publisher: ""
  }]);

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
            const booksData = await booksResponse.json();
            console.log(`Type of booksData is: ${typeof booksData}`);
            console.log(booksData);
            for (const book of booksData) {
              console.log(book);
            }
            setBooks(booksData);
          } catch (err) {
            console.log(`Error getting books data from response: ${err}`);
          }
        }
      } catch (err) {
        console.log(`Error fetching books: ${err}`);
      }
    };

    fetchBooks();
  }, [userContext.token]);

  const bookList = books.length === 0
    ? "No books to show!"
    : books.map((book: IBook, index: number) => <BookInfo {...book} key={index} />)
  ;

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