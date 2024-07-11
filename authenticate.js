const passport = require("passport");
const jwt = require("jsonwebtoken");
const math = require("mathjs");
const { SESSION_EXPIRY, JWT_SECRET, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET } = process.env;

exports.COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  signed: true,
  sameSite: "None",
  maxAge: math.evaluate(SESSION_EXPIRY) * 1000,
  path: "https://personal-library-server.vercel.app/api/users/refreshToken",
  partitioned: true
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