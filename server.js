const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const connectDB = require("./config/db");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

connectDB();

const app = express();

require("./strategies/JwtStrategy");
require("./strategies/LocalStrategy");
require("./authenticate");

const users = require("./routes/api/users");
const books = require("./routes/api/books");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

const CLIENT_URL = "https://personal-library-app.vercel.app";

app.use(cors({
  origin: [`${CLIENT_URL}`, `${CLIENT_URL}/`],
  methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
  credentials: true
}));

app.use(passport.initialize());

app.use("/api/users/", users);
app.use("/api/books", books);

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./client", "build")));
  app.get("/*", (req, res) => res.sendFile(path.join(__dirname, "./client", "build", "index.html")));
}

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;