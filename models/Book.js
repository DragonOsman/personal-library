const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  published_date: {
    type: String
  },
  publisher: {
    type: String,
    required: true
  },
  updated_date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Type.ObjectId,
    ref: "User"
  }
});

const Book = mongoose.model("Book", BookSchema);

module.exports = { Book, BookSchema };