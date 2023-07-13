import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate, useParams } from "react-router-dom";

const ShowBookDetails = () => {
  const { userContext, setUserContext } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const bookRef = useRef({
    book: {
      _id: "",
      title: "",
      isbn: "",
      author: "",
      description: "",
      published_date: "",
      publisher: ""
    }
  });

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(
          `https://personal-library-server.onrender.com/api/books/show-book/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userContext.token}`
            },
            credentials: "include",
            mode: "cors"
          }
        );

        if (response.ok) {
          try {
            const data = await response.json();
            bookRef.current = data.book;
          } catch (err) {
            console.log(`Error when running "const data = await response.json()": ${err}`);
          }
        } else {
          console.log("HTTP response when trying to fetch book details not ok!  Something's wrong!");
        }
      } catch (err) {
        console.log(`Error trying to fetch book details: ${err}`);
      }
    };

    fetchBookDetails();
  }, [id, userContext.token]);

  const onDeleteClick = async (id: string) => {
    try {
      fetch(
        `https://personal-library-server.onrender.com/api/books/delete-book/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userContext.token}`
          },
          mode: "cors",
          credentials: "include"
        }
      );
      navigate("/");
    } catch (err) {
      console.log(`Error trying to delete book: ${err}`);
    }
  };

  const BookItem = (
    <div>
      <table className="table-hover table-dark table">
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Title</td>
            <td>{bookRef.current.book.title}</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Author</td>
            <td>{bookRef.current.book.author}</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>ISBN</td>
            <td>{bookRef.current.book.isbn}</td>
          </tr>
          <tr>
            <th scope="row">4</th>
            <td>Description</td>
            <td>{bookRef.current.book.description}</td>
          </tr>
          <tr>
            <th scope="row">5</th>
            <td>Publisher</td>
            <td>{bookRef.current.book.publisher}</td>
          </tr>
          <tr>
            <th scope="row">6</th>
            <td>Publishing Date</td>
            <td>{bookRef.current.book.published_date}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container container-fluid">
      <div className="row">
        <div className="col-md-8 m-auto">
          <Link to="/books/list-books" className="btn btn-outline-warning float-left">
            Show Book List
          </Link>
        </div>
        <br />
        <div className="col-md-8 m-auto">
          <h1 className="display-4 text-center">Book Record</h1>
          <p className="lead text-center">View Book Info</p>
          <hr /> <br />
        </div>
        <div className="col-md-10 m-auto">{BookItem}</div>
        <div className="col-md-6 m-auto">
          <button
            type="button"
            className="btn btn-outline-danger btn-lg btn-block"
            onClick={() => {
              onDeleteClick(bookRef.current.book._id);
            }}
          >
            Delete Book
          </button>
        </div>
        <div className="col-md-6 m-auto">
          <Link
            to={`/edit-book/${bookRef.current.book._id}`}
            className="btn btn-outline-info btn-lg btn-block"
          >
              Edit Book
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShowBookDetails;