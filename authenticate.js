const passport = require("passport");
const jwt = require("jsonwebtoken");
const math = require("mathjs");
const { SESSION_EXPIRY, JWT_SECRET } = process.env;

exports.COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  signed: true,
  maxAge: math.evaluate(SESSION_EXPIRY) * 1000,
  sameSite: "strict"
};

exports.getToken = user => {
  return jwt.sign(user, JWT_SECRET, {
    expiresIn: math.evaluate(SESSION_EXPIRY)
  });
};

exports.verifyUser = passport.authenticate("jwt", { session: false });