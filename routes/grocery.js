const express = require('express');
const router = express.Router();
const groceryCtrl = require('../controllers/grocery');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// All paths start with root '/'

// GET /grocery (index functionality)
router.get('/grocery', ensureLoggedIn, groceryCtrl.index);
// POST /grocery (create functionality)
router.post('/grocery', ensureLoggedIn, groceryCtrl.create);
// DELETE /item/:id (delete functionality)
router.delete('/grocery/item/:id', ensureLoggedIn, groceryCtrl.delete);

module.exports = router;