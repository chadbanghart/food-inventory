const Inventory = require('../models/inventory');

module.exports = {
  index
};

async function index(req, res) {
  const inventory = await Inventory.find({});
  res.render('inventory/index', { title: 'My Inventory', inventory });
}