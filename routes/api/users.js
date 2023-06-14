const express = require("express");
const userRouter = express.Router();
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

const { getToken, COOKIE_OPTIONS, getRefreshToken } = require("../authenticate");

// @route POST api/users/register
// @desc Register user
// @access Public
userRouter.post("/register", async (req, res, next) => {
  // Verify that first name is not empty
  if (!req.body.firstName) {
    res.statusCode = 500;
    res.send({
      name: "FirstNameError",
      message: "The first name is required"
    });
  } else {
    User.register(
      new User({ username: req.body.username }),
      req.body.password,
      async (err, user) => {
        try {
          if (err) {
            res.statusCode = 500;
            res.send(err);
          } else {
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            const token = getToken({ _id: user._id });
            const refreshToken = getRefreshToken({ _id: user._id });
            user.refreshToken.push({ refreshToken });
            await user.save();
            res.cookie("refrehToken", refreshToken, COOKIE_OPTIONS);
            res.send({ success: true, token });
          }
        } catch (err) {
          res.statusCode = 500;
          res.send(err);
        }
      }
    );
  }
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