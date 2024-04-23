const Grocery = require('../models/grocery');
const Item = require('../models/item');

module.exports = {
  index,
  create: addItem
};

async function index(req, res) {
  const grocery = await Grocery.findOne({user: req.user._id}).populate('groceryItem');
  res.render('grocery/index', { title: 'My Grocery List', grocery });
}

async function addItem(req, res) {
  try {
    let item = await Item.findOne({ name: req.body.item });
    if (!item) {
      item = await Item.create({ name: req.body.item });
      await item.save();
    }
    
    // Check for existing grocery list
    let grocery = await Grocery.findOne({user: req.user._id});
    if (grocery) {
      grocery.groceryItem.push(item);
      await grocery.save();
    } else {
      // No Grocery list found, create new
      const newGrocery = await Grocery.create({
        user: req.user._id,
        groceryItem: [item]
      });
      await newGrocery.save();
    }
    res.redirect('/grocery');
  } catch (err) {
    console.log(err.message);
    res.render('grocery/index', {title: 'Grocery List', errorMsg: err.message });
  }
}