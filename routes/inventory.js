const express = require('express');
const router = express.Router();
const inventoryCtrl = require('../controllers/inventory');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// all paths start with /

//GET /inventory
router.get('/inventory', ensureLoggedIn, inventoryCtrl.index);

module.exports = router;