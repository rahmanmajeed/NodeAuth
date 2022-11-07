const { json } = require('express');
const express = require('express');

const router = express.Router();
const {
  register, loginUser, update, deleteUser, test,
} = require('./Auth');

router.route('/register').post(register);
router.route('/login').post(loginUser);
router.route('/update').put(update);
router.route('/delete').delete(deleteUser);
router.route('/test').get(test);

module.exports = router;
