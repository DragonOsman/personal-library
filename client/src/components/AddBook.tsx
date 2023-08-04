import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { UserContext } from "../context/UserContext";
import * as Yup from "yup";
import "./AddBook.css";

const AddBook = () => {
  const { userContext, setUserContext } = useContext(UserContext);

  const navigate = useNavigate();

  interface FormValues {
    title: string;
    isbn: string;
    author: string;
    description: string;
    published_date: string;
    publisher: string;
  }

  const formik = useFormik({
    initialValues: {
      title: "",
      isbn: "",
      author: "",
      description: "",
      published_date: "",
      publisher: ""
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("Book title is required"),
      author: Yup.string()
        .required("Book author is required"),
      isbn: Yup.string()
        .required("ISBN is required"),
      publisher: Yup.string()
        .required("Publisher is requried"),
      description: Yup.string()
        .required("Description is required")
    }),
    onSubmit: async (values: FormValues) => {
      formik.setSubmitting(true);

      const book = {
        title: values.title,
        isbn: values.isbn,
        author: values.author,
        description: values.description,
        published_date: (values.published_date ? values.published_date : ""),
        publisher: values.publisher
      };

      try {
        const response = await fetch(
          "https://personal-library-server.onrender.com/api/books/add-book", {
            method: "POST",
            credentials: "include",
            headers: {
              "Authorization": `Bearer ${userContext.token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(book)
          }
        );

        if (response.ok) {
          navigate("/");
        } else {
          console.log("Something went wrong when trying to add a book!");
        }
      } catch (err) {
        console.log(`Inside catch block for add-book form submission handler: ${err}`);
      }
    }
  });

  return (
    <div className="add-book-form-container">
      <div className="row">
        <div className="col-md-8 m-auto">
          <Link
            to="/"
            className="book-list-link btn btn-warning"
          >
            Back to Home
          </Link>
        </div>
        <div className="col-md-8 m-auto">
          <h1 className="display-4 text-center">Add Book</h1>
          <p className="lead text-center">Add new book</p>
          <form onSubmit={
            (event) => {
              event.preventDefault();
              formik.handleSubmit(event);
            }}
            method="post"
          >
            <fieldset className="mb-3">
              <legend>Add Book</legend>
              <label htmlFor="title" className="form-label">Book Title</label>:
              <input
                type="text"
                className="title form-control form-control-lg"
                placeholder="Please enter book's title"
                required
                {...formik.getFieldProps("title")}
              />
              {formik.touched.title && formik.errors.title ? (
                <small className="text-danger">{formik.errors.title}</small>
              ) : null}
              <label htmlFor="author" className="form-label">Book Author</label>:
              <input
                type="text"
                className="author form-control form-control-lg"
                placeholder="Please enter name of book's author"
                required
                {...formik.getFieldProps("author")}
              />
              {formik.touched.author && formik.errors.author ? (
                <small className="text-danger">{formik.errors.author}</small>
              ) : null}
              <label htmlFor="isbn" className="form-label">Book ISBN</label>:
              <input
                type="text"
                className="isbn form-control form-control-lg"
                placeholder="Please enter ISBN of book"
                required
                {...formik.getFieldProps("isbn")}
            />
              {formik.touched.isbn && formik.errors.isbn ? (
                <small className="text-danger">{formik.errors.isbn}</small>
              ) : null}
              <label htmlFor="description" className="form-label">Book Description</label>:
              <input
                type="text"
                className="description form-control form-control-lg"
                placeholder="Please enter description for book"
                required
                {...formik.getFieldProps("description")}
              />
              {formik.touched.description && formik.errors.description ? (
                <small className="text-danger">{formik.errors.description}</small>
              ) : null}
              <label htmlFor="publisher" className="form-label">Book Publisher</label>:
              <input
                type="text"
                className="publisher form-control form-control-lg"
                placeholder="Please enter book publisher's name"
                required
                {...formik.getFieldProps("publisher")}
              />
              {formik.touched.publisher && formik.errors.publisher ? (
                <small className="text-danger">{formik.errors.publisher}</small>
              ) : null}
              <label htmlFor="publisher_date" className="form-label">Book Publishing Date</label>:
              <input
                type="text"
                className="published-date form-control form-control-lg"
                placeholder="Please enter book's publishing date"
                {...formik.getFieldProps("published_date")}
              />
            </fieldset>
            <input type="submit" value="Add Book" className="btn btn-primary btn-lg" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBook;