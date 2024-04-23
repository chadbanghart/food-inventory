const express = require('express');
const router = express.Router();
const groceryCtrl = require('../controllers/grocery');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// All paths start with root '/'

// GET /grocery (index functionality)
router.get('/grocery', ensureLoggedIn, groceryCtrl.index);
// POST /grocery/:id/item (create functionality)
router.post('/grocery', ensureLoggedIn, groceryCtrl.create);

module.exports = router;