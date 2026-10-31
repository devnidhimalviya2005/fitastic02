const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
  index: true,
},
  activity: {
    type: String,
    required: true,
    enum: ["walking", "running", "cycling", "swimming", "strength", "other"],
  },
  customActivity: {
    type: String,
    trim: true,
    default: "",
    maxlength: 80,
  },
  intensity: {
    type: String,
    required: true,
    enum: ["light", "moderate", "vigorous"],
  },
  durationMinutes: {
    type: Number,
    required: true,
    min: 1,
    max: 600,
  },
  weightKg: {
    type: Number,
    required: true,
    min: 1,
    max: 500,
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

module.exports = mongoose.model("Workout", workoutSchema);