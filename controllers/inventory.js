const Inventory = require('../models/inventory');
const Item = require('../models/item');

module.exports = {
  index,
  new: newInventory,
  create
};


async function index(req, res) {
  const inventory = await Inventory.find({}).populate('inventoryItem.item');
  res.render('inventory/index', { title: 'My Inventory', inventory });
}

function newInventory(req, res) {
  res.render('inventory/new', { title: 'New Inventory', errorMsg: ''});
}

async function create(req, res) {
  req.body.favitem = !!req.body.favitem;
  const userId = req.user._id;

  try {
      let item = await Item.findOne({ name: req.body.item });
      if (!item) {
          item = await Item.create({ name: req.body.item });
      }

      // Construct the new inventory item object
      const newInventoryItem = {
          item: item._id,
          quantity: req.body.quantity,
          unit: req.body.unit,
          expire: req.body.expire,
          location: req.body.location,
          favItem: req.body.favItem
      };

      // Check for existing inventory
      let inventory = await Inventory.findOne({ user: userId });
      if (inventory) {
          // Inventory exists, add new item
          inventory.inventoryItem.push(newInventoryItem);
          await inventory.save();
      } else {
          // No inventory found, create new
          await Inventory.create({
              user: userId,
              inventoryItem: [newInventoryItem]
          });
      }
    res.redirect('/inventory');
  } catch (err) {
    console.log(err);
    res.render('inventory/new', { title: 'New Inventory', errorMsg: err.message });
  }
}