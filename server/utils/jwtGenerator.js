const jwt = require("jsonwebtoken");

const generateJWTToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    throw new Error("Token is invalid");
  }
};

module.exports = { generateJWTToken, verifyToken };
