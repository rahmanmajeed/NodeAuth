/* eslint-disable no-empty */
const jwt = require('jsonwebtoken');

const secret = '4715aed3c946f7b0a38e6b534a9583628d84e96d10fbc04700770d572af3dce43625dd';

exports.authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
      } else if (decodedToken.role !== 'admin') {
      } else {
        next();
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: 'Not authorized, token not available' });
  }
};
