const passport = require("passport");
const jwt = require("jsonwebtoken");
const math = require("mathjs");
const { SESSION_EXPIRY, JWT_SECRET, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET } = process.env;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  signed: true,
  sameSite: "none"
};

exports.ACCESS_TOKEN_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: math.evaluate(SESSION_EXPIRY) * 1000,
  path: "/users/accessToken"
};

exports.REFRESH_TOKEN_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: math.evaluate(REFRESH_TOKEN_EXPIRY) * 1000,
  path: "/users/refreshToken"
};

exports.getToken = user => {
  return jwt.sign(user, JWT_SECRET, {
    expiresIn: math.evaluate(SESSION_EXPIRY)
  });
};

exports.getRefreshToken = user => {
  const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, {
    expiresIn: math.evaluate(REFRESH_TOKEN_EXPIRY)
  });
  return refreshToken;
};

exports.verifyUser = passport.authenticate("jwt", { session: false });