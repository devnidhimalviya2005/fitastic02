
const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodName: String,
  category: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
  quantity: { type: Number, required: true },
  calories: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meal', mealSchema);