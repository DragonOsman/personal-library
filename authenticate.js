const passport = require("passport");
const jwt = require("jsonwebtoken");
const math = require("mathjs");

require("dotenv").config();

exports.COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  signed: true,
  maxAge: math.evaluate(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
  sameSite: "none"
};

exports.REFRESH_COOKIE_OPTIONS = {
  ...this.COOKIE_OPTIONS,
  path: "https://personal-library-rvi3.onrender.com/api/users/refreshToken"
};

exports.SESSION_COOKIE_OPTIONS = {
  ...this.COOKIE_OPTIONS,
  maxAge: math.evaluate(process.env.SESSION_EXPIRY)
};

exports.getToken = user => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: math.evaluate(process.env.SESSION_EXPIRY)
  });
};

exports.getRefreshToken = user => {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: math.evaluate(process.env.REFRESH_TOKEN_EXPIRY)
  });
  return refreshToken;
};

exports.verifyUser = passport.authenticate("jwt", { session: false });