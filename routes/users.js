const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/users');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// this router is mounted to a path that start with '/users'

// get /users (show user index action)
router.get('/', ensureLoggedIn, usersCtrl.index);

module.exports = router;
