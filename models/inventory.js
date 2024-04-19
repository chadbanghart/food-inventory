const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventoryItemSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: Number,
    min: 0
  },
  unit: {
    type: String
  },
  item: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  dateOfExpire: {
    type: Date
  },
  location: {
    type: String,
    enum: ['Fridge', 'Freezer', 'Pantry']
  },
  favItem: {
    type: Boolean
  } 
}, {
  timestamps: true
})

const inventorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inventoryItem: [inventoryItemSchema]
},
{
  timestamps: true
});

module.exports = mongoose.model('Inventory', inventorySchema);