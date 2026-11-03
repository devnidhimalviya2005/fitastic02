
const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  activity: {
    type: String,
    required: true,
    trim: true,
  },

  customActivity: {
    type: String,
    trim: true,
    default: '',
    maxlength: 80,
  },

  intensity: {
    type: String,
    enum: ['light', 'moderate', 'vigorous'],
    default: 'moderate',
  },

  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 600,
  },

  distance: {
    type: Number,
    default: 0,
    min: 0,
  },

  caloriesBurned: {
    type: Number,
    required: true,
    min: 0,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Workout', workoutSchema);
