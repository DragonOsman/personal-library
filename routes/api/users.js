const express = require("express");
const userRouter = express.Router();
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
// eslint-disable-next-line no-unused-vars
const keys = require("../../config/keys");

// @route POST api/users/register
// @desc Register user
// @access Public
userRouter.post("/register", async (req, res) => {

});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
userRouter.post("/login", async (req, res) => {

});

// @route GET api/users/user-info/:id
// @desc Send user details by id
// @access Public
userRouter.get("/user-info/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(400).json({ success: false, error: "User not found" });
    }
  } catch (err) {
    console.log(err);
  }
});

// @route GET api/users/get-email
// @desc Send user's email address (for GET route below)
// @access Public
userRouter.get("/is-user-auth", (req, res) => {
  res.json({ isLoggedIn: true,
             email: req.user.email,
             firstName: req.user.firstName,
             lastName: req.user.lastName
           });
});

module.exports = userRouter;