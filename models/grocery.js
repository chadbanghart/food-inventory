const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const grocerySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Grocery', grocerySchema);