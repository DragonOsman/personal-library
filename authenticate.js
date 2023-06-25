const passport = require("passport");
const jwt = require("jsonwebtoken");
const math = require("mathjs");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const User = require("./models/User");
require("dotenv").config();

exports.COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  signed: true,
  maxAge: math.evaluate(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
  sameSite: "none"
};

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
opts.secretOrKey = process.env.JWT_SECRET;

exports.jwtPassport = passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findOne({ _id: jwt_payload._id });
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}));

exports.verifyUser = passport.authenticate("jwt", { session: false });