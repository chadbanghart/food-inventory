const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const grocerySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  groceryItem: [{
    type: Schema.Types.ObjectId,
    ref: 'Item',
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Grocery', grocerySchema);