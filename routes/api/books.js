const express = require("express");
const bookRouter = express.Router();
const { Book } = require("../../models/Book");

bookRouter.post("/add-book", async (req, res) => {
  res.setHeader("Access-Control-Allow-Methods", "POST");
  try {
    await Book.create(req.body);
    res.json({ message: "book added successfully" });
  } catch (err) {
    res.status(400).json({ error: "Unable to add this book" });
  }
});

bookRouter.get("/list-books", async (req, res) => {
  res.setHeader("Access-Control-Allow-Methods", "GET");
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(404).json({ error: "No books found" });
  }
});

bookRouter.get("/show-book/:id", async (req, res) => {
  res.setHeader("Access-Control-Allow-Methods", "GET");
  try {
    const book = await Book.findById(req.params.id);
    res.json(book);
  } catch (err) {
    res.status(404).json({ error: "No book found" });
  }
});

bookRouter.put("/update-book/:id", async (req, res) => {
  res.setHeader("Access-Control-Allow-Methods", "PUT");
  try {
    await Book.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Book updated successfully" });
  } catch (err) {
    res.status(400).json({ error: "Unable to update database" });
  }
});

bookRouter.delete("/delete-book/:id", async (req, res) => {
  res.setHeader("Access-Control-Allow-Methods", "DELETE");
  try {
    await Book.findByIdAndRemove(req.params.id, req.body);
    res.json({ message: "Book entry deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "No such book exists" });
  }
});

module.exports = bookRouter;