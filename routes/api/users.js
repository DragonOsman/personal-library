const express = require("express");
const userRouter = express.Router();
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const{ JWT_SECRET, SESSION_EXPIRY } = require("dotenv").config();

const validateRegisterInput = require("../../user-validation/register");
const validateLoginInput = require("../../user-validation/login");

const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
  verifyUser
 } = require("../../authenticate");

const bodyParser = require("body-parser");
userRouter.use(bodyParser.urlencoded({ extended: false }));
userRouter.use(bodyParser.json());

// @route POST api/users/register
// @desc Register user
// @access Public
userRouter.post("/register", async (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);

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
      (err, user) => {
        try {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: false, err });
          } else {
            passport.authenticate("local")(req, res, next, async () => {
              const token = getToken({ _id: user._id });
              const refreshToken = getRefreshToken({ _id: user._id });
              user.refreshToken.push({ refreshToken });
              await user.save();
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.cookie("refrehToken", refreshToken, COOKIE_OPTIONS);
              res.json({
                success: true,
                status: "Registration successfull!",
                token
              });
            });
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
userRouter.post("/login", passport.authenticate("local"), async (req, res, next) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    res.status(400).json(errors);
    for (const error in errors) {
      console.log(error);
    }
  }

  const token = getToken({ _id: req.user._id });
  const refreshToken = getRefreshToken({ _id: req.user._id });
  try {
    const user = await User.findById(req.user._id);
    user.refreshToken = refreshToken;
    try {
      await user.save();
      res.setHeader("Content-Type", "application/json");
      res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
      res.json({ success: true, token: `jwt ${token}`, user });
    } catch (err) {
      res.statusCode = 500;
      console.log(`In login route, inner catch block: ${err}`);
      res.send(err);
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
  const signedCookies = req.signedCookies;
  const refreshToken = signedCookies.refreshToken;

  console.log(req.cookies);
  console.log(signedCookies);

  if (refreshToken) {
    try {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          res.statusCode = 401;
          res.json({ message: "Unauthorized" });
        } else {
          const token = jwt.sign(JWT_SECRET, {
            expiresIn: SESSION_EXPIRY
          });
          res.json({ token });
        }
      });

    } catch (err) {
      res.statusCode = 401;
      res.send("Unauthorized");
      return next(err);
    }
  } else {
    res.statusCode = 401;
    res.send("Unauthorized");
    console.log("No refresh token in cookies");
  }
});

// @route GET api/users/user-info
// @desc Send user details
// @access Public
userRouter.get("/user-info/", verifyUser, (req, res, next) => {
  res.send(req.user);
});

// @route GET api/users/logout
// @desc Log user out
// @access Public
userRouter.get("/logout", verifyUser, async (req, res, next) => {
  console.log(`/logout route, req.cookies: ${req.cookies}`);
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  try {
    const user = await User.findById(req.user._id);
    if (user.refreshToken === refreshToken) {
      user.refreshToken = "";
    }

    try {
      await User.save();
      res.clearCookie("refreshToken", COOKIE_OPTIONS);
      if (req.session) {
        res.clearCookie("session-id");
        res.session.destroy();
      }
      res.json({ success: true });
    } catch (err) {
      res.statusCode = 500;
      res.send(err);
      return next(err);
    }

  } catch (err) {
    res.statusCode = 404;
    res.send(err);
  }
});

module.exports = userRouter;