const express = require("express");
const userRouter = express.Router();
const User = require("../models/User");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const validateRegisterInput = require("../user-validation/register");
const validateLoginInput = require("../user-validation/login");
const {
  getToken,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
  verifyUser,
  JWT_SECRET,
  REFRESH_TOKEN_SECRET,
  getRefreshToken
 } = require("../authenticate");

userRouter.post("/register", (req, res) => {
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
      }, req.body.password,
      async (err, user) => {
        if (err) {
          res.statusCode = 500;
          res.json({ error: err });
          return;
        } else {
          const token = getToken({ _id: user._id });
          const refreshToken = getRefreshToken({ _id: user._id });
          try {
            await user.save();
            res.cookie("accessToken", token, ACCESS_TOKEN_COOKIE_OPTIONS);
            res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
          } catch (err) {
            res.statusCode = 500;
            res.json({ error: err });
          }
        }
      }));
    }
  } catch (err) {
    res.json({ err });
  }
});

userRouter.post("/login", passport.authenticate("local", { session: false }),
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
        res.cookie("accessToken", token, ACCESS_TOKEN_COOKIE_OPTIONS);
        res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
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

userRouter.get("/user-info", verifyUser, (req, res, next) => res.json({ user: req.user }));

userRouter.get("/logout", verifyUser, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      try {
        await user.save();
        res.clearCookie("accessToken", ACCESS_TOKEN_COOKIE_OPTIONS);
        res.clearCookie("refreshTOken", REFRESH_TOKEN_COOKIE_OPTIONS);
      } catch (err) {
        res.statusCode = 500;
        res.json({ error: err });
      }
    }
  } catch (err) {
    return next(err);
  }
});

userRouter.get("/csrf-token", verifyUser, (req, res) => res.json({ csrfToken: req.csrfToken() }));

userRouter.get("/accessToken", verifyUser, async (req, res, next) => {
  const accessToken = req.signedCookies.accessToken;

  if (accessToken) {
    try {
      const payload = jwt.verify(accessToken, JWT_SECRET);
      const userId = payload._id;
      const user = await User.findOne({ _id: userId });
      if (user) {
        res.json({ success: true, accessToken });
      } else {
        res.statusCode = 401;
        res.json({ success: false, error: "user not found" });
      }
    } catch (err) {
      res.statusCode = 401;
      res.json({ message: "Unauthorized" });
      return next(err);
    }
  } else {
    res.statusCode = 401;
    res.json({ message: "Unauthorized" });
  }
});

userRouter.post("/refreshToken", async (req, res, next) => {
  const refreshToken = req.signedCookies.refreshToken;

  if (refreshToken) {
    try {
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
        } else {
          const token = getToken({ _id: userId });
          const newRefreshToken = getRefreshToken({ _id: userId });
          user.refreshTokens[tokenIndex] = { refreshToken: newRefreshToken };
          try {
            await user.save();
            res.cookie("refreshToken", newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
            res.cookie("accessToken", token, ACCESS_TOKEN_COOKIE_OPTIONS);
            res.json({ success: true });
          } catch (err) {
            res.statusCode = 500;
            res.json({ error: err });
          }
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