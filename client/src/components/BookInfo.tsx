import { IBook } from "../context/BookContext";
import "./BookInfo.css";

const BookInfo = (bookObj: IBook) => {
  const book = bookObj.book;
  return (
    <div className="container container-fluid">
      <img
        src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d"
        alt="Books"
        height={200}
      />
      <div className="desc">
        <h2>{book.title}</h2>
        <h3>{book.author}</h3>
        <p>{book.description}</p>
      </div>
    </div>
  );
};

export default BookInfo;