const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  servingSize: String,
  calories: { type: Number, required: true }
});

module.exports = mongoose.model('Food', foodSchema);