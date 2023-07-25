import { useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useFormik } from "formik";
import * as Yup from "yup";

const UpdateBookInfo = () => {
  const { userContext, setUserContext } = useContext(UserContext);

  const { id } = useParams();
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
        const response = await fetch(`
        https://personal-library-server.onrender.com/api/books/update-book/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userContext.token}`
            },
            body: JSON.stringify(book)
          }
        );

        if (!response.ok) {
          console.log("Something went wrong when trying to update book!");
          console.log(`${response.text()}`);
        }

        navigate("/");
      } catch (err) {
        console.log(`Error while making request update-book/:id route: ${err}`);
      }
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("Book title is required"),
      author: Yup.string()
        .required("Book author is required"),
      isbn: Yup.string()
        .matches(/[0-9-]{10}|[0-9-]{13}/g, "ISBN must have 10 to 13 digits with some hyphens")
        .required("ISBN is required"),
      publisher: Yup.string()
        .required("Publisher is requried"),
      description: Yup.string()
        .required("Description is required")
    })
  });

  return (
    <div className="update-book container-fluid">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <br />
            <Link to="/books/list-books" className="btn btn-outline-warning float-left">
              List Books
            </Link>
          </div>
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Edit Book</h1>
            <p className="lead text-center">Update Book Info</p>
          </div>
        </div>

        <div className="col-md-8 m-auto">
          <form
            onSubmit={
              (event) => {
                event.preventDefault();
                formik.handleSubmit(event);
              }
            }
            method="post"
          >
            <fieldset className="mb-3">
              <legend>Edit Book</legend>
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
            <input type="submit" value="Edit Book" className="btn btn-primary btn-lg" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateBookInfo;