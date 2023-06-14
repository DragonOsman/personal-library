const mongoose = require("mongoose");
const { BookSchema } = require("./Book");
const passportLocalMongoose = require("passport-local-mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  refreshToken: {
    type: String,
    default: ""
  }
});

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    default: ""
  },
  lastName: {
    type: String,
    required: true,
    default: ""
  },
  email: {
    type: String,
    required: true,
    default: ""
  },
  authStrategy: {
    type: String,
    required: true,
    default: "local"
  },
  books: {
    type: [BookSchema],
    required: true,
    default: []
  },
  refreshToken: {
    type: [SessionSchema]
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Remove refreshToken from the response
UserSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    delete ret.refreshToken;
    return ret;
  }
});

UserSchema.pre("save", async function() {
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.plugin(passportLocalMongoose());

const User = mongoose.model("User", UserSchema);

module.exports = User;