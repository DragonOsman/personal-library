const express = require("express");
const userRouter = express.Router();
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const keys = require("../../config/keys");
const validateLoginInput = require("../../user-validation/login");
const validateRegisterInput = require("../../user-validation/register");
const verifyJWT = require("../../middleware/verifyJWT");

// @route POST api/users/register
// @desc Register user
// @access Public
userRouter.post("/register", async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    for (let i = 0; i < Array(errors); i++) {
      console.log(`line 19: errors object: ${Array(errors)[i]}`);
    }
    return res.status(400).json(errors);
  }

  let user;
  try {
    user = await User.findOne({ email: req.body.email });
    if (user) {
      console.log("Line 28 console.log");
      return res.status(400).json("A user by that email already exists");
    } else {
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      });

      // The user registered for an account, so it's an 'internal' user
      newUser.kind = "internal";

      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(newUser.password, salt);
      newUser.password = hash;
      user = await newUser.save();
      res.json({ success: true, user, message: "You are registered!" });
    }
  } catch (error) {
    console.log(`Error trying to register user: ${error}`);
  }
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
userRouter.post("/login", async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    for (let i = 0; i < Array(errors); i++) {
      console.log(`line 60: errors object: ${Array(errors)[i]}`);
    }
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "Email not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const payload = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      };

      jwt.sign(
        payload,
        keys.secretOrKey,
        {
          expiresIn: 86400
        },
        (err, token) => {
          res.json({
            success: true,
            token: `Bearer ${token}`
          });
        }
      );
    } else {
      console.log("Line 95 console log");
      return res.status(400).json({ error: "Incorrect password" });
    }
  } catch (err) {
    console.log(err);
  }
});

// @route GET api/users/user-info/:id
// @desc Send user details by id
// @access Public
userRouter.get("/user-info/:id", verifyJWT, async (req, res) => {
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
userRouter.get("/is-user-auth", verifyJWT, (req, res) => {
  res.json({ isLoggedIn: true,
             email: req.user.email,
             firstName: req.user.firstName,
             lastName: req.user.lastName
           });
});

module.exports = userRouter;