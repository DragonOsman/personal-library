const mongoose = require("mongoose");
const dbURI = require("./keys").mongoURI;

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  try {
    const db = await mongoose.connect(dbURI);
    console.log("connected to database");
     db.connection
     .on("error", () => console.log("error occurred while trying to connect to database"))
     .on("disconnected", () => console.log("disconnected from database!"))
    ;
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;