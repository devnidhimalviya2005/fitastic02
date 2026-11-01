
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: Number,
  height: Number,
  weight: Number,
  calorieTarget: { type: Number, default: 2000 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);