const Inventory = require('../models/inventory');
const Item = require('../models/item');
const Grocery = require('../models/grocery');

module.exports = {
  index,
  new: newInventory,
  create,
  edit,
  update,
  delete: deleteOne,
  addGrocery
};

async function addGrocery(req, res) {
  const item = await Item.findById({_id: req.body.item});
  const grocery = await Grocery.findOne({user: req.user._id});
  grocery.groceryItem.push(item);
  await grocery.save();
  res.redirect('/grocery');
}

async function deleteOne(req, res) {
  const inventory = await Inventory.findOne({'inventoryItem._id': req.params.id});
  inventory.inventoryItem.remove(req.params.id);
  // Save the updated inventory
  await inventory.save();
  // Redirect back to the inventory's show view
  res.redirect(`/inventory`);
}

async function update(req, res) {
  const inventory = await Inventory.findOne({'inventoryItem._id': req.params.id});
  let inventoryItemSubDoc = inventory.inventoryItem.id(req.params.id);
  let item = await Item.findOneAndUpdate({_id: req.body.itemId}, {name: req.body.item}, {new: true});
  await item.save();
  inventoryItemSubDoc.item = item;
  inventoryItemSubDoc.quantity = req.body.quantity;
  inventoryItemSubDoc.unit = req.body.unit;
  inventoryItemSubDoc.expire = req.body.expire;
  inventoryItemSubDoc.location = req.body.location;
  inventoryItemSubDoc.favItem = !!req.body.favItem;
  
  try {
    await inventory.save();
  } catch (err) {
    console.log(err.message);
  }
  // Redirect back to the book's show view
  res.redirect(`/inventory`);
}

// async function index(req, res) {
//   const inventory = await Inventory.find({user: req.user._id}).populate('inventoryItem.item');
//   res.render('inventory/index', { title: 'My Inventory', inventory });
// }

async function index(req, res) {
  const inventory = await Inventory.find({ user: req.user._id }).populate('inventoryItem.item');
  let sort = req.query.sort || 'createdAt';
  if (sort.includes('-')) {
    sort = sort.substring(1);
    if (sort === 'item') {
      inventory[0].inventoryItem.sort((a, b) => a[sort].name < b[sort].name ? 1 : -1);
    } else {
      inventory[0].inventoryItem.sort((a, b) => a[sort] < b[sort] ? 1 : -1);
    }
  } else {
    if (sort === 'item') {
      inventory[0].inventoryItem.sort((a, b) => b[sort].name < a[sort].name ? 1 : -1);
    } else {
      inventory[0].inventoryItem.sort((a, b) => b[sort] < a[sort] ? 1 : -1);
    }
  }
  res.render('inventory/index', { title: 'My Inventory', inventory, sort });
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
          favItem: !!req.body.favItem
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

async function edit(req, res) {
  req.body.favitem = !!req.body.favitem;
  const userId = req.user._id;
  const id = req.params.id;
  try {
    const inventory = await Inventory.findOne({user: userId, 'inventoryItem._id': id}, 'inventoryItem.$').populate('inventoryItem.item');
    if (!inventory) return res.render('/inventory');
    const item = inventory.inventoryItem[0];
    item.expireFormatted = formatDate(item.expire);
    res.render(`inventory/edit`, { title: 'Edit Inventory Item', item});
  } catch (err) {
    console.log(err);
    res.render('inventory/edit', { title: 'Edit Inventory', errorMsg: err.message });
  }
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1),
      day = '' + (d.getDate()),
      year = d.getFullYear();
  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;
  return [year, month, day].join('-');
}