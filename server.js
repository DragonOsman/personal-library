const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const connectDB = require("./config/db");
const cors = require("cors");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.use(cors());

const CLIENT_URL = "https://personal-library-client.vercel.app";
const whitelist = [CLIENT_URL];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  maxAge: 86400
};
app.use(cors(corsOptions));

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

app.use(passport.initialize());

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

app.get("/", (req, res) => res.json({ status: "success" }));

const PORT = 3000 || process.env.PORT;

app.listen(PORT, (err) => {
  if (err) {
    console.log(`error in server setup: ${err}`);
  }
  console.log(`server running on port ${PORT}`);
});