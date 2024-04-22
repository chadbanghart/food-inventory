const express = require('express');
const router = express.Router();
const inventoryCtrl = require('../controllers/inventory');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// all paths start with /

//GET /inventory
router.get('/inventory', ensureLoggedIn, inventoryCtrl.index);
// GET /inventory/new (new action)
router.get('/inventory/new', ensureLoggedIn, inventoryCtrl.new);
// GET /inventory/:id/edit (edit action)
router.get('/inventory/:itemId/edit', ensureLoggedIn, inventoryCtrl.edit);
// POST /inventory (create action)
router.post('/inventory', ensureLoggedIn, inventoryCtrl.create);

module.exports = router;