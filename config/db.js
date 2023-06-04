const mongoose = require("mongoose");
const config = require("config");
const dbURI = config.get("mongoURI");

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  try {
    const db = await mongoose.connect(dbURI);
    db.connection.on("connected", () => console.log("connected to database"))
     .on("error", () => console.log("error occurred while trying to connect to database"))
     .on("disconnected", () => console.log("disconnected from database!"))
    ;
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;