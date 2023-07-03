const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const path = require("path");
const connectDB = require("./config/db");

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

const CLIENT_URL = "https://personal-library-client.vercel.app";

app.use(cors({
  origin: CLIENT_URL,
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: true,
  allowedHeaders: [
    "Authorization", "Accept", "Keep-Alive",
    "Content-Type", "Content-Length", "Content-Language",
    "Cookie", "Content-Encoding", "Cache-Control",
    "Origin", "Access-Control-Request-Method", "Access-Control-Max-Age"
  ]
}));

app.use(passport.initialize());

app.use("/api/users/", users);
app.use("/api/books", books);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./client", "build")));
  app.get("/*", (req, res) => res.sendFile(path.join(__dirname, "./client", "build", "index.html")));
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;