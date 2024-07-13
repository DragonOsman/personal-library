const express = require("express");
const bookRouter = express.Router();
const Book = require("../../models/Book");
const { verifyUser } = require("../../authenticate");

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
    console.log("Validation error occurred during book data input, add book route");
  }

  try {
    await Book.create({ ...req.body, userId: req.user._id });
    res.json({ message: "book added successfully" });
  } catch (err) {
    res.status(400).json({ error: "Unable to add this book" });
    console.log(`Error when trying to add book: ${err.message}`);
  }
});

bookRouter.get("/list-books", verifyUser, async (req, res) => {
  try {
    // return only this user's books
    const books = await Book.find({ userId: req.user._id });
    res.status(200).json({ books, success: true });
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

  try {
    await Book.findByIdAndUpdate({ ...req.body, _id: req.params.id, userId: req.user._id });
    res.json({ message: "Book updated successfully" });
  } catch (err) {
    res.status(400).json({ error: "Unable to update database" });
  }
});

bookRouter.delete("/delete-book/:id", verifyUser, async (req, res) => {
  try {
    await Book.findByIdAndRemove({ ...req.body, _id: req.params.id, userId: req.user._id });
    res.json({ message: "Book entry deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "No such book exists" });
  }
});

module.exports = bookRouter;