const express = require("express");
const bookRouter = express.Router();
const { Book } = require("../../models/Book");
const cors = require("cors");

const { verifyUser } = require("../../authenticate");

const CLIENT_URL = "https://personal-library-ejl3.onrender.com";

const corsOptions = {
  origin: CLIENT_URL,
  headers: "Content-Type, X-Requested-With, Accept, Authorization, Connection",
  methods: "GET, HEAD, PUT, DELETE, POST, OPTIONS",
  credentials: true
};

bookRouter.post("/add-book", verifyUser, async (req, res) => {
  const {
    title,
    author,
    isbn,
    publisher,
    description
  } = req.body;

  if (title === "" || author === "" || isbn === "", publisher === "", description === "") {
    res.statusCode = 400;
    res.json({ error: "Book title, author, ISBN, publisher and description are required!" });
  }

  if (!isbn.match(/[0-9-]{10}|[0-9-]{13}/g)) {
    res.statusCode = 400;
    res.json({ error: "ISBN is invalid!" });
  }

  try {
    await Book.create(req.body);
    res.json({ message: "book added successfully" });
  } catch (err) {
    res.status(400).json({ error: "Unable to add this book" });
  }
});

bookRouter.get("/list-books", verifyUser, async (req, res) => {
  try {
    const books = await Book.find();
    res.json({ books });
  } catch (err) {
    res.status(404).json({ error: "No books found" });
  }
});

bookRouter.get("/show-book/:id", verifyUser, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.json({ book });
  } catch (err) {
    res.status(404).json({ error: "No book found" });
  }
});

bookRouter.put("/update-book/:id", verifyUser, async (req, res) => {
  const {
    title,
    author,
    isbn,
    publisher,
    description
  } = req.body;

  if (title === "" || author === "" || isbn === "", publisher === "", description === "") {
    res.statusCode = 400;
    res.json({ error: "Book title, author, ISBN, publisher and description are required!" });
  }

  if (!isbn.match(/[0-9-]{10}|[0-9-]{13}/g)) {
    res.statusCode = 400;
    res.json({ error: "ISBN is invalid!" });
  }

  try {
    await Book.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Book updated successfully" });
  } catch (err) {
    res.status(400).json({ error: "Unable to update database" });
  }
});

bookRouter.delete("/delete-book/:id", verifyUser, async (req, res) => {
  try {
    await Book.findByIdAndRemove(req.params.id, req.body);
    res.json({ message: "Book entry deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "No such book exists" });
  }
});

module.exports = bookRouter;