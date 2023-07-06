const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password"
},
async (email, password, cb) => {
  try {
    const user = await User.findOne();
    if (!user) {
      return cb(null, false, { message: "Incorrect email or password" });
    }
    return cb(null, user, { message: "Logged in successfully" });
  } catch (err) {
    return cb(err);
  }
}));