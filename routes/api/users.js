const express = require("express");
const userRouter = express.Router();
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const keys = require("../../config/keys");
const validateLoginInput = require("../../user-validation/login");
const validateRegisterInput = require("../../user-validation/register");

// @route POST api/users/register
// @desc Register user
// @access Public
userRouter.post("/register", async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  let user;
  try {
    user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json("A user by that email already exists");
    } else {
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
      });

      // The user registered for an account, so it's an 'internal' user
      newUser.kind = "internal";

      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(newUser.password, salt);
      newUser.password = hash;
      user = await newUser.save();
      res.json(user);
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
        firstname: user.firstname,
        lastname: user.lastname
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
      return res.status(400).json({ error: "Incorrect password" });
    }
  } catch (err) {
    console.log(err);
  }
});

// @route POST api/users/user-info/:id
// @desc Send user details
// @access Public
userRouter.get("/user-info/:id", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (user) {
      res.json(user);
    } else {
      res.status(400).json({ success: false, error: "User not found" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = userRouter;