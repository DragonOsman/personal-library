const express = require("express");
const connectDB = require("./config/db");
const app = express();
const cors = require("cors");

connectDB();

const books = require("./routes/api/books");

app.use(cors({ origin: true, credentials: true }));

app.use(express.json({ extended: false }));

app.use("/api/books", books);

app.get("/", (req, res) => res.send({ success: true }));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));