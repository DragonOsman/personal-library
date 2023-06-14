const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const connectDB = require("./config/db");
const cors = require("cors");
const books = require("./routes/api/books");
const users = require("./routes/api/users");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connectDB();

app.use(cors({
  origin: "http://localhost:3000/",
  methods: ["GET", "PUT", "POST", "DELETE"],
  credentials: true }
));

app.use("/api/users/", users);

app.use("/api/books", books);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));