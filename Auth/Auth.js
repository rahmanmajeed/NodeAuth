/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Model/User');

const jwtSecret = '4715aed3c946f7b0a38e6b534a9583628d84e96d10fbc04700770d572af3dce43625dd';

exports.register = async (req, res, next) => {
  const { username, password } = req.body;
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: 'password less than 6 characters.' });
  }
  try {
    // Inserting document into MongoDB
    bcrypt.hash(password, 10).then(async (hash) => {
      await User.create({
        username,
        password: hash,
      }).then((user) => res.status(200).json({
        message: 'User successfully created',
        user,
      }));
    });
  } catch (err) {
    res.status(401).json({
      message: 'User not successful created',
      error: err.mesage,
    });
  }
};

exports.loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  // Check if username and password is provided
  if (!username || !password) {
    return res.status(400).json({
      message: 'Username or Password not present',
    });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({
        message: 'Login not successful',
        error: 'User not found',
      });
    } else {
      // comparing given password with hashed password
      bcrypt.compare(password, user.password).then((result) => {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, username, role: user.role },
            jwtSecret,
            { expiresIn: maxAge },
          );

          res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(201).json({
            message: 'User successfully Logged in',
            user: user._id,
            role: user.role,
          });
        } else {
          res.status(400).json({ message: 'Login not succesful' });
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      message: 'An error occurred',
      error: error.message,
    });
  }
};

exports.update = async (req, res, next) => {
  const { role, id } = req.body;
  // First - Verifying if role and id is presnt
  if (role && id) {
    // Second - Verifying if the value of role is admin
    if (role === 'admin') {
      // Finds the user with the id
      await User.findById(id)
        .then((user) => {
          // Third - Verifies the user is not an admin
          if (user.role !== 'admin') {
            user.role = role;
            user.save((err) => {
              // Monogodb error checker
              if (err) {
                res.status(400).json({
                  message: 'An error occurred',
                  error: err.message,
                });
                process.exit(1);
              }
              res.status(201).json({
                message: 'Update successful',
                user,
              });
            });
          } else {
            res.status(400).json({
              message: 'User is already an Admin',
            });
          }
        })
        .catch((error) => {
          res.status(400).json({
            message: 'An error occurred',
            error: error.message,
          });
        });
    }
  }
};

exports.deleteUser = async (req, res, next) => {
  const { id } = req.body;
  await User.findById(id)
    .then((user) => user.remove())
    .then((user) => res.status(201).json({ message: 'User successfully deleted', user }))
    .catch((error) => res
      .status(400)
      .json({ message: 'An error occurred', error: error.message }));
};
exports.test = async (req, res, next) => res.status(200).json({ message: 'yest route' });
