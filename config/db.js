const mongoose = require("mongoose");
//const MongoStore = require("connect-mongo");
require("dotenv").config();

const dbURI = process.env.MONGO_DB_CONNECTION_STRING;

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  try {
    const dbConnection = await mongoose.createConnection(dbURI, { dbName: "personal-library" });
    console.log("connected to database");
    dbConnection
      .on("error", () => console.log("error occurred while trying to connect to database"))
      .on("disconnected", () => console.log("disconnected from database!"))
    ;

    /*const sessionStore = new MongoStore({
      mongooseConnection: dbConnection,
      client: dbConnection.getClient(),
      dbName: "Users",
      collectionName: "user-sessions"
    });

    exports.sessionStore = sessionStore;*/
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;