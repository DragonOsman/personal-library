const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
require("dotenv").config();

const dbURI = process.env.MONGO_DB_CONNECTION_STRING;

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  try {
    const db = await mongoose.connect(dbURI, { dbName: "personal-library" });
    console.log("connected to database");
    const connection = db.connection;
    connection
      .on("error", () => console.log("error occurred while trying to connect to database"))
      .on("disconnected", () => console.log("disconnected from database!"))
    ;

    const sessionStore = new MongoStore({
      mongooseConnection: connection,
      dbName: "Users",
      collectionName: "user-sessions"
    });

    exports.sessionStore = sessionStore;
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;