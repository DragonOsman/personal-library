const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const connectDB = require("./config/db");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

connectDB();

const app = express();

require("./strategies/JwtStrategy");
require("./strategies/LocalStrategy");
require("./authenticate");

const userRouter = require("./routes/api/users");
const bookRouter = require("./routes/api/books");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

const CLIENT_URL = "https://personal-library-ejl3.onrender.com";

const corsOptions = {
  origin: CLIENT_URL,
  headers: "Content-Type, X-Requested-With, Accept, Authorization, Connection",
  methods: "GET, HEAD, PUT, DELETE, POST, OPTIONS",
  credentials: true
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions), (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
  res.setHeader("Access-Control-Allow-Headers",
    "Content-Type, X-Requested-With, Accept, Authorization, Connection");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, PUT, DELETE, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.status(200).json({ success: true });
});

app.use(passport.initialize());

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

app.get("/", (req, res) => res.json({ status: "success" }));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));