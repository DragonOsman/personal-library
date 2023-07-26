const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const connectDB = require("./config/db");
const cors = require("cors");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

connectDB();

const app = express();

const CLIENT_URL = "https://personal-library-ejl3.onrender.com";
const whitelist = [CLIENT_URL];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  headers: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization", "Connection"],
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"]
};
app.use(cors(corsOptions));

app.options("*", cors(corsOptions), (req, res, next) => {
  res.status(200).json({ success: true });
});

require("./strategies/JwtStrategy");
require("./strategies/LocalStrategy");
require("./authenticate");

const userRouter = require("./routes/api/users");
const bookRouter = require("./routes/api/books");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(passport.initialize());

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

app.get("/", (req, res) => res.json({ status: "success" }));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));