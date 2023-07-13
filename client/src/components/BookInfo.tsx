import { IBook } from "../context/BookContext";
import { Link } from "react-router-dom";
import "./BookInfo.css";

const BookInfo = (book: IBook) => {
  return (
    <div className="container row">
      <div className="col-md-8 m-auto">
        <img
          src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d"
          alt="Books"
          height={200}
        />
        <div className="desc">
          <h2><Link to={`/books/show-book/${book._id}`}>{book.title}</Link></h2>
          <h3>{book.author}</h3>
          <p>{book.description}</p>
        </div>
      </div>
    </div>
  );
};

export default BookInfo;