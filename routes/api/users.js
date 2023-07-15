const express = require("express");
const userRouter = express.Router();
const User = require("../../models/User");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");

const validateRegisterInput = require("../../user-validation/register");
const validateLoginInput = require("../../user-validation/login");
const {
  getToken,
  COOKIE_OPTIONS,
  verifyUser,
  getRefreshToken
 } = require("../../authenticate")
;

const { REFRESH_TOKEN_SECRET } = process.env;

const CLIENT_URL = "https://personal-library-ejl3.onrender.com";

const corsOptions = {
  origin: CLIENT_URL,
  headers: "Content-Type, X-Requested-With, Accept, Authorization, Connection",
  methods: "GET, HEAD, PUT, DELETE, POST, OPTIONS",
  credentials: true
};

userRouter.post("/register", cors(corsOptions), (req, res) => {
  try {
    const { isValid, errors } = validateRegisterInput(req.body);
    if (!isValid) {
      res.statusCode = 400;
      if (errors.password) {
        res.json({ error: errors.password });
        return;
      } else if (errors.confirmPassword) {
        res.json({ error: errors.confirmPassword });
        return;
      } else if (errors.email) {
        res.json({ error: errors.email });
        return;
      } else if (errors.firstName) {
        res.json({ error: errors.firstName });
        return;
      } else if (errors.lastName) {
        res.json({ error: errors.lastName });
        return;
      }
    } else {
      User.register(new User({
        username: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      }), req.body.password,
      async (err, user) => {
        if (err) {
          res.statusCode = 500;
          res.json({ error: err });
          return;
        } else {
          const token = getToken({ _id: user._id });
          const refreshToken = getRefreshToken({ _id: user._id });
          user.refreshTokens.push({ refreshToken });
          try {
            await user.save();
            res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
            res.json({ success: true, token });
          } catch (err) {
            res.statusCode = 500;
            res.json({ error: err });
          }
        }
      });
    }
  } catch (err) {
    res.json({ err });
  }
});

userRouter.post("/login", [passport.authenticate("local", { session: false }), cors(corsOptions)],
    async (req, res, next) => {
  const token = getToken({ _id: req.user._id });
  const refreshToken = getRefreshToken({ _id: req.user._id });
  try {
    const { isValid, errors } = validateLoginInput(req.body);
    if (!isValid) {
      res.statusCode = 400;
      if (errors.email) {
        res.json({ error: errors.email });
        return;
      } else if (errors.password) {
        res.json({ error: errors.password });
        return;
      }
    }
    const user = await User.findById(req.user._id);
    if (user) {
      user.refreshTokens.push({ refreshToken });
      try {
        await user.save();
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
        res.json({ success: true, token });
      } catch (err) {
        res.statusCode = 500;
        res.json({ error: err });
      }
    } else {
      res.statusCode = 401;
      res.json({ message: "Unauthorized: User not found" });
    }
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: err });
    return next(err);
  }
});

userRouter.get("/user-info", verifyUser,
(req, res, next) => res.json({ user: req.user }));

userRouter.get("/logout", [verifyUser, cors(corsOptions)], async (req, res, next) => {
  const refreshToken = req.signedCookies.refreshToken;
  const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.refreshTokens.filter(
        item => item.refreshToken !== refreshToken && item.refreshToken._id !== payload._id
      );

      try {
        await user.save();
        res.clearCookie("refreshToken", COOKIE_OPTIONS);
        res.json({ success: true });
      } catch (err) {
        res.statusCode = 500;
        console.log(`Error inside inner catch block in logout route: ${err}`);
        res.json({ error: err });
      }
    }
  } catch (err) {
    return next(err);
  }
});

userRouter.post("/refreshToken", cors(corsOptions), async (req, res, next) => {
  const refreshToken = req.signedCookies.refreshToken;

  if (refreshToken) {
    try {
      res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
      const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
      const userId = payload._id;
      const user = await User.findOne({ _id: userId });
      if (user) {
        const tokenIndex = user.refreshTokens.findIndex(
          item => item.refreshToken === refreshToken
        );

        if (tokenIndex === -1) {
          res.statusCode = 401;
          res.json({ message: "Unauthorized" });
        }

        const token = getToken({ _id: userId });
        const newRefreshToken = getRefreshToken({ _id: userId });
        user.refreshTokens.push({ refreshToken: newRefreshToken });

        try {
          await user.save();
          res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
          res.json({ success: true, token });
        } catch (err) {
          res.statusCode = 500;
          res.json({ error: err });
        }
      } else {
        res.statusCode = 401;
        res.json({ message: "Unauthorized" });
      }
    } catch (err) {
      res.statusCode = 401;
      res.json({ message: "Unauthorized" });
      return next(err);
    }
  }
});

module.exports = userRouter;