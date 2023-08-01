const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

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
  authStrategy: {
    type: String,
    required: true,
    default: "local"
  },
  refreshTokens: {
    type: [SessionSchema]
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Remove refresh token from the response:
UserSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    delete ret.refreshTokens;
    return ret;
  }
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", UserSchema);

module.exports = User;