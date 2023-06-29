const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const path = require("path");
const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const dbURI = process.env.MONGO_DB_CONNECTION_STRING;

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(dbURI, { dbName: "personal-library" });
    const connection = mongoose.connection;
    connection.on("error", () => console.log("error occurred while trying to connect to database"))
      .on("disconnected", () => console.log("disconnected from database!"))
    ;
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const port = process.env.PORT || 5000;

const app = express();



require("./strategies/JwtStrategy");
require("./strategies/LocalStrategy");
require("./authenticate");

const users = require("./routes/api/users");
const books = require("./routes/api/books");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(cors({
  origin: "*",
  methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
  credentials: false
}));

app.use(passport.initialize());

app.use("/api/users/", users);
app.use("/api/books", books);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./client", "build")));
  app.get("/*", (req, res) => res.sendFile(path.join(__dirname, "./client", "build", "index.html")));
}

connectDB().then(app.listen(port, () => console.log(`Server running on port ${port}`)));

module.exports = app;