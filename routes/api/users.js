const express = require("express");
const userRouter = express.Router();
const User = require("../../models/User");
const passport = require("passport");
require("dotenv").config();

const validateRegisterInput = require("../../user-validation/register");
const validateLoginInput = require("../../user-validation/login");

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
    }
    const user = User.register(new User({
      username: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }, req.body.password));
    res.json({ success: true, message: "Successful", user });
  } catch (err) {
    res.json({ err });
  }
});

module.exports = userRouter;