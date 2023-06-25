const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const dbURI = process.env.MONGO_DB_CONNECTION_STRING;

mongoose.set("strictQuery", true);
let dbConnection;
try {
  dbConnection = mongoose.createConnection(dbURI, { dbName: "personal-library" });
  console.log("connected to database");
  dbConnection
    .on("error", () => console.log("error occurred while trying to connect to database"))
    .on("disconnected", () => console.log("disconnected from database!"))
  ;
} catch (err) {
  console.log(err);
  process.exit(1);
}

const app = express();

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
    mongooseConnection: dbConnection,
    dbName: "personal-library",
    collectionName: dbConnection.collection("users").name,
    client: dbConnection.getClient()
  })
}));

passport.initialize();

app.use("/api/users/", users);
app.use("/api/books", books);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));