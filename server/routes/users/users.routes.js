const express = require('express');
const router = express.Router();

//controller functions
const { signUpUser, signInUser } = require('./users.controller');

router.post('/signup', signUpUser);
router.post('/signin', signInUser);

module.exports = router;