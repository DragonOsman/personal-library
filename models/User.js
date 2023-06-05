const mongoose = require("mongoose");
const { BookSchema } = require("./Book");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

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
  password: {
    type: String,
    required: true,
    default: "dUmMy-p@$$wOrD123"
  },
  kind: {
    type: String,
    required: true,
    default: "internal"
  },
  books: {
    type: [BookSchema],
    required: true,
    default: []
  },
});

UserSchema.pre("save", async function() {
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", UserSchema);

module.exports = User;