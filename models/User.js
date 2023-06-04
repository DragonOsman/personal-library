const mongoose = require("mongoose");
const { BookSchema } = require("./Book");
const bcrypt = require("bcrypt");

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
    required: false,
    default: "dUmMy-p@$$word123"
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
  account: {
    type: AccountSchema,
    required: true
  }
});

let salt;
(async () => {
  try {
    salt = await bcrypt.genSalt(10);
    AccountSchema.password = await bcrypt.hash(AccountSchema.password, salt);
  } catch (err) {
    console.log(err);
  }
})();

const User = mongoose.model("User", UserSchema);

module.exports = User;