const express = require("express");
const userRouter = express.Router();
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("dotenv").config();

const validateRegisterInput = require("../../user-validation/register");
const validateLoginInput = require("../../user-validation/login");

const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
  verifyUser
 } = require("../../authenticate");

// @route POST api/users/register
// @desc Register user
// @access Public
userRouter.post("/register", async (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Allow", "POST");

  if (!isValid) {
    res.statusCode = 400;
    res.send({
      name: "Errors",
      message: "There are errors",
      errors
    });
  } else {
    User.register(
      new User({
        username: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      }),
      req.body.password,
      async (err, user) => {
        try {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: false, err });
            return;
          } else {
            const token = getToken({ _id: user._id });
            const refreshToken = getRefreshToken({ _id: user._id });
            user.refreshTokens.push({ refreshToken });
            try {
              await user.save();
              res.setHeader("Content-Type", "application/json");
              res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
              res.json({ success: true, token: `Bearer ${token}` });
            } catch (err) {
              res.statusCode = 500;
              res.json({ err });
              return;
            }
          }
        } catch (err) {
          res.statusCode = 500;
          res.send(err);
          return;
        }
      }
    );
  }
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
userRouter.post("/login", passport.authenticate("local", { session: false }),
  async (req, res, next) => {
  const { errors, isValid } = validateLoginInput(req.body);

  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Allow", "POST");

  if (!isValid) {
    res.status(400).json(errors);
    for (const error in errors) {
      console.log(error);
      for (const errorDetail in Object.values(errors)) {
        console.log(errorDetail);
      }
    }
    return;
  }

  const token = getToken({ _id: req.user._id });
  const refreshToken = getRefreshToken({ _id: req.user._id });
  try {
    const user = await User.findById(req.user._id);
    user.refreshTokens.push({ refreshToken });
    try {
      await user.save();
      res.setHeader("Content-Type", "application/json");
      res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
      res.json({ success: true, token, user });
    } catch (err) {
      res.statusCode = 500;
      console.log(`In login route, inner catch block: ${err}`);
      res.send(err);
      return;
    }
  } catch (err) {
    console.log(`In login route, outer catch block: ${err}`);
    return next(err);
  }
});

// @route POST api/users/refreshToken
// @desc Refresh JWT and allow user to access protected routes
// @access Public
userRouter.post("/refreshToken", async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Allow", "POST");

  const signedCookies = req.signedCookies;
  const refreshToken = signedCookies.refreshToken;
  if (refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const userId = payload._id;
      const user = await User.findOne({ _id: userId });
      if (user) {
        const tokenIndex = user.refreshTokens.findIndex(
          item => item.refreshToken === refreshToken
        );

        if (tokenIndex === -1) {
          res.statusCode = 401;
          res.json({ message: "Unauthorized" });
          console.log("Error is inside tokenIndex check condition block");
        } else {
          const token = getToken({ _id: userId });
          const newRefreshToken = getRefreshToken({ _id: userId });
          user.refreshTokens[tokenIndex] = { refreshToken: newRefreshToken };
          try {
            await user.save();
            res.setHeader("Content-Type", "application/json");
            res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
            res.json({ success: true, token, user });
          } catch (err) {
            res.statusCode = 500;
            res.json({ err });
            return;
          }
        }
      }
    } catch (err) {
      res.statusCode = 401;
      res.send("Unauthorized");
      console.log("Error is inside outer catch block");
      return next(err);
    }
  } else {
    res.statusCode = 401;
    res.send("Unauthorized");
    console.log("No refresh token in cookies");
    return;
  }
});

// @route GET api/users/user-info
// @desc Send user details
// @access Public
userRouter.get("/user-info", verifyUser, (req, res, next) => {
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Allow", "GET");
  res.json({ success: true, user: req.user });
});

// @route GET api/users/logout
// @desc Log user out
// @access Public
userRouter.get("/logout", verifyUser, async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Allow", "GET");
  const signedCookies = req.signedCookies;
  const refreshToken = signedCookies.refreshToken;
  try {
    const user = await User.findById({ _id: req.user._id });
    const tokenIndex = user.refreshTokens.findIndex(
      item => item.refreshToken === refreshToken
    );

    if (tokenIndex !== -1) {
      user.refeshTokens.id(user.refreshTokens[tokenIndex]._id).remove();
    }
    user.refreshTokens = [];

    try {
      await user.save();
      res.clearCookie("refreshToken", COOKIE_OPTIONS);
      res.json({ success: true });
    } catch (err) {
      res.statusCode = 500;
      res.json({ err });
      return;
    }
  } catch (err) {
    res.send(err);
    return next(err);
  }
});

module.exports = userRouter;