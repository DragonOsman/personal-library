const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
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

const CLIENT_URL = "https://personal-library-client.onrender.com";

app.use(cors({
  origin: [`${CLIENT_URL}`, `${CLIENT_URL}/`],
  methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
  credentials: true
}));

const { COOKIE_OPTIONS } = require("./authenticate");

app.use(session({
  resave: true,
  saveUninitialized: false,
  cookie: COOKIE_OPTIONS,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    dbName: "personal-library",
    client: mongoose.connection.getClient()
  })
}));

//passport.initialize();

app.use("/api/users/", users);
app.use("/api/books", books);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));