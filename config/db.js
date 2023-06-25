const mongoose = require("mongoose");
require("dotenv").config();

const dbURI = process.env.MONGO_DB_CONNECTION_STRING;

const connectDB = () => {
  mongoose.set("strictQuery", true);
  try {
    mongoose.connect(dbURI, { dbName: "personal-library" });
    console.log("connected to database");
    mongoose.connection.on("error", () => console.log("error occurred while trying to connect to database"));
    mongoose.connection.on("disconnected", () => console.log("disconnected from database!"));
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;