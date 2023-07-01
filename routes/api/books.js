const express = require("express");
const bookRouter = express.Router();
const { Book } = require("../../models/Book");

const CLIENT_URL = "https://personal-library-client.vercel.app";

bookRouter.post("/add-book", async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", [CLIENT_URL, `${CLIENT_URL}/`]);
    await Book.create(req.body);
    res.json({ message: "book added successfully" });
  } catch (err) {
    res.status(400).json({ error: "Unable to add this book" });
  }
});

bookRouter.get("/list-books", async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", [CLIENT_URL, `${CLIENT_URL}/`]);
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(404).json({ error: "No books found" });
  }
});

bookRouter.get("/show-book/:id", async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", [CLIENT_URL, `${CLIENT_URL}/`]);
    const book = await Book.findById(req.params.id);
    res.json(book);
  } catch (err) {
    res.status(404).json({ error: "No book found" });
  }
});

bookRouter.put("/update-book/:id", async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", [CLIENT_URL, `${CLIENT_URL}/`]);
    await Book.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Book updated successfully" });
  } catch (err) {
    res.status(400).json({ error: "Unable to update database" });
  }
});

bookRouter.delete("/delete-book/:id", async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", [CLIENT_URL, `${CLIENT_URL}/`]);
    await Book.findByIdAndRemove(req.params.id, req.body);
    res.json({ message: "Book entry deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "No such book exists" });
  }
});

module.exports = bookRouter;