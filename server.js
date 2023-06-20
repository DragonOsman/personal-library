const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
const math = require("mathjs");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const connectDB = require("./config/db");
connectDB();

require("./strategies/JwtStrategy");
require("./strategies/LocalStrategy");
require("./authenticate");

const app = express();

const { COOKIE_OPTIONS } = require("./authenticate");

app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: false,
  cookie: COOKIE_OPTIONS,
  maxAge: math.evaluate(process.env.SESSION_EXPIRY)
 }));

const users = require("./routes/api/users");
const books = require("./routes/api/books");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(passport.initialize());

app.use("/api/users/", users);
app.use("/api/books", books);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));