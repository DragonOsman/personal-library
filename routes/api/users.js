const express = require("express");
const userRouter = express.Router();
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("config");
const jwtSecret = config.get("jwtSecret");
const { body } = require("express-validator");
const auth = require("../../middleware/auth");

userRouter.post("/register", async (req, res) => {
  const { firstname, lastname, email, password, password2 } = req.body;
  let user;

  try {
    user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ msg: "User already exists" });
    }

    if (!body("email").isEmail({ email: email })) {
      res.status(400).json({ msg: "Email is invalid" });
    }

    if (!body("password").equals(password, password2)) {
      res.status(400).json({ msg: "Passwords must match" });
    }

    user = new User({
      firstname,
      lastname,
      email,
      password,
      books: [],
      kind: "internal"
    });

    await bcrypt.genSalt(12, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) {
          console.error(err);
        }
        user.password = hash;
      });
    });
    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: 3 * 24 * 60 * 60 },
      (err, token) => {
        if (err) {
          throw err;
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({ msg: "Email doesn't exist in database" });
    }

    if (user.kind === "internal") {
      const password = req.body.password;
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Incorrect password" });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        jwtSecret,
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({ token });
        }
      );
    } else {
      res.json({ msg: "Log in with third-party auth provider" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

userRouter.get("/info", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = userRouter;