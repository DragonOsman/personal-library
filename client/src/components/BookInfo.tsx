import { IBook } from "../context/BookContext";
import "./BookInfo.css";

const BookInfo = (book: IBook) => {
  console.log(`book inside BookInfo: ${book}`);
  for (const key of Object.keys(book)) {
    for (const value of Object.values(book)) {
      console.log(`${key}:${value}`);
    }
  }
  return (
    <div className="container container-fluid">
      <img
        src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d"
        alt="Books"
        height={200}
      />
      <div className="desc">
        <h2>{book.book.title}</h2>
        <h3>{book.book.author}</h3>
        <p>{book.book.description}</p>
      </div>
    </div>
  );
};

export default BookInfo;