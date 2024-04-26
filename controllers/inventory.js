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
  const inventory = await Inventory.findOne({'inventoryItems._id': req.params.id});
  inventory.inventoryItems.remove(req.params.id);
  await inventory.save();
  res.redirect(`/inventory`);
}

async function update(req, res) {
  const inventory = await Inventory.findOne({'inventoryItems._id': req.params.id});
  let inventoryItemSubDoc = inventory.inventoryItems.id(req.params.id);
  let item = await Item.findOneAndUpdate({_id: req.body.itemId}, {name: req.body.item}, {new: true});
  await item.save();
  inventoryItemSubDoc.item = item;
  inventoryItemSubDoc.quantity = req.body.quantity;
  inventoryItemSubDoc.unit = req.body.unit;
  inventoryItemSubDoc.expire = req.body.expire;
  inventoryItemSubDoc.category = req.body.category;
  inventoryItemSubDoc.location = req.body.location;
  inventoryItemSubDoc.favItem = !!req.body.favItem;
  try {
    await inventory.save();
  } catch (err) {
    console.log(err.message);
  }
  res.redirect(`/inventory`);
}


async function index(req, res) {
  const inventory = await Inventory.find({ user: req.user._id }).populate('inventoryItems.item');
  let inventoryMsg = null;
  const expireMsg = 'You have Items that are about to expire! Consider removing from inventory and/or adding to your grocery list!';
  const favItemExpireMsg = "One of your favorite items is about to expire. It has been added to your Grocery List for you!";
  const bothMsg = 'You have both favorite items and regular items expiring soon! The favorite item has been added to your grocery list.'
  // inventory[0].inventoryItems.filter(function(i) {
  //   let date = i.expire;
  //   let favItem = i.favItem;
  //   if (expiresSoon(date) && favItem) {
  //     inventoryMsg = favItemExpireMsg;
  //   } 
  //   // else if (expiresSoon(date)) {
  //   //   inventoryMsg = expireMsg;
  //   // } else {
  //   //   inventoryMsg = 'false';
  //   // }
  //   console.log(inventoryMsg);
  // });
  const favItemExpire = inventory[0].inventoryItems.some((i, idx) => (expiresSoon(i.expire) && i.favItem));
  const expirefilter = inventory[0].inventoryItems.some((i, idx) => (expiresSoon(i.expire) && !i.favItem));
  const bothExpire = favItemExpire && expirefilter;
  console.log(bothExpire);
  // inventoryMsg = favItemExpire ? favItemExpireMsg : expirefilter ? expireMsg : '';
  inventoryMsg = bothExpire ? bothMsg : favItemExpire ? favItemExpireMsg : expirefilter ? expireMsg : '';
  
  let sort = req.query.sort || 'createdAt';
  if (inventory  && inventory.length) {
    if (sort.includes('-')) {
      sort = sort.substring(1);
      if (sort === 'item') {
        inventory[0].inventoryItems.sort((a, b) => a[sort].name < b[sort].name ? 1 : -1);
      } else {
        inventory[0].inventoryItems.sort((a, b) => a[sort] < b[sort] ? 1 : -1);
      }
    } else {
      if (sort === 'item') {
        inventory[0].inventoryItems.sort((a, b) => b[sort].name < a[sort].name ? 1 : -1);
      } else {
        inventory[0].inventoryItems.sort((a, b) => b[sort] < a[sort] ? 1 : -1);
      }
    }
  }
  res.render('inventory/index', { title: 'My Inventory', inventory, sort, inventoryMsg: inventoryMsg, formatDate, expiresSoon });
}

function newInventory(req, res) {
  res.render('inventory/new', { title: 'Add New Item to Inventory', errorMsg: ''});
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
          category: req.body.category,
          favItem: !!req.body.favItem
      };

      // Check for existing inventory
      let inventory = await Inventory.findOne({ user: userId });
      if (inventory) {
          // Inventory exists, add new item
          inventory.inventoryItems.push(newInventoryItem);
          await inventory.save();
      } else {
          // No inventory found, create new
          await Inventory.create({
              user: userId,
              inventoryItems: [newInventoryItem]
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
    const inventory = await Inventory.findOne({user: userId, 'inventoryItems._id': id}, 'inventoryItems.$').populate('inventoryItems.item');
    if (!inventory) return res.render('/inventory');
    const item = inventory.inventoryItems[0];
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
      day = '' + (d.getDate()+ 1),
      year = d.getFullYear();
  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;
  return [year, month, day].join('-');
}

function expiresSoon(date) {
  if (!date) return false;
  const today = new Date();
  const expireDate = new Date(date);
  const threeDaysLater = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);
  return expireDate <= threeDaysLater;
}