const express = require("express");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

connectDB();

const books = require("./routes/api/books");
const users = require("./routes/api/users");

app.use(cors({ origin: true, credentials: true }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/users/", users);

app.use("/api/books", books);

app.get("/", (req, res) => res.send({ success: true }));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));