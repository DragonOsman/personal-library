const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const connectDB = require("./config/db");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connectDB();

const books = require("./routes/api/books");
const users = require("./routes/api/users");

app.use(cors({
  origin: ["http://localhost:5000/", "http://localhost:3000/"],
  methods: ["GET", "PUT", "POST", "DELETE"],
  credentials: true }
));

app.use("/api/users/", users);

app.use("/api/books", books);

app.get("/", (req, res) => res.send({ success: true }));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));