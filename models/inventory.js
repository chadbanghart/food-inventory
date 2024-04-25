const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventoryItemSchema = new Schema({
  quantity: {
    type: Number,
    min: 0,
    required: true
  },
  unit: {
    type: String
  },
  item: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  expire: {
    type: Date
  },
  category: {
    type: String
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
  inventoryItems: [inventoryItemSchema]
},
{
  timestamps: true
});

module.exports = mongoose.model('Inventory', inventorySchema);