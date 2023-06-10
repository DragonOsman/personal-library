const keys = require("../config/keys");
const jwt = require("jsonwebtoken");

// Authentication middleware
// for verifying the JWT
const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"]?.split(" ")[1];

  if (token) {
    jwt.verify(token, keys.secretOrKey, (err, decoded) => {
      if (err) {
        return res.json({
          isLoggedIn: false,
          message: "Failed to authenticate user"
        });
      }
      req.user = {};
      req.user.id = decoded.id;
      req.user.email = decoded.email;
      req.user.firstname = decoded.firstname;
      req.user.lastname = decoded.lastname;
      next();
    });
  } else {
    res.json({
      message: "Incorrect Token Given",
      isLoggedIn: false
    });
  }
};

module.exports = verifyJWT;