const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

exports.userAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        res.status(401).send({ message: "Not Authorized", error: err });
      } else {
        next();
      }
    });
  } else {
    res.status(401).send("don't try shortcut")
    // location.assign('/')
    
  }
};
