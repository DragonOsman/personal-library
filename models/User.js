const mongoose = require("mongoose");
const { BookSchema } = require("./Book");

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  kind: {
    type: String,
    required: true,
    default: "internal"
  },
  uid: {
    type: String,
    required: false,
    default: ""
  },
  username: {
    type: String,
    required: false,
    default: ""
  },
  password: {
    type: String,
    required: true,
    default: "dummy"
  }
});

const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    default: ""
  },
  lastname: {
    type: String,
    required: true,
    default: ""
  },
  email: {
    type: String,
    required: true,
    default: ""
  },
  books: {
    type: [BookSchema],
    required: true,
    default: []
  },
  accounts: {
    type: [AccountSchema],
    required: true
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;