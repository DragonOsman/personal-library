const express = require("express");
const userRouter = express.Router();
const User = require("../models/User");
const passport = require("passport");
require("dotenv").config();

const validateRegisterInput = require("../user-validation/register");
const validateLoginInput = require("../user-validation/login");
const { getToken, COOKIE_OPTIONS, verifyUser } = require("../authenticate");

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
          try {
            await user.save();
            res.cookie("accessToken", token, COOKIE_OPTIONS);
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
      res.cookie("accessToken", token, COOKIE_OPTIONS);
    }
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: err });
    return next(err);
  }
});

userRouter.get("/user-info", verifyUser, (req, res, next) => res.json({ user: req.user }));

module.exports = userRouter;