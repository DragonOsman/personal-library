const express = require("express");
const userRouter = express.Router();
const User = require("../models/User");
const passport = require("passport");
require("dotenv").config();

const validateRegisterInput = require("../user-validation/register");
const validateLoginInput = require("../user-validation/login");
const { getToken } = require("../authenticate");

userRouter.post("/register", (req, res) => {
  try {
    const { isValid, errors } = validateRegisterInput(req.body);
    if (!isValid) {
      res.status(400);
      if (errors.password) {
        res.json({ error: errors.password });
      } else if (errors.confirmPassword) {
        res.json({ error: errors.confirmPassword });
      } else if (errors.email) {
        res.json({ error: errors.email });
      } else if (errors.firstName) {
        res.json({ error: errors.firstName });
      } else if (errors.lastName) {
        res.json({ error: errors.lastName });
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
            res.json({ success: true, message: "Registered", token: `Bearer ${token}` });
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

});

module.exports = userRouter;