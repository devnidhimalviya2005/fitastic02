const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },

    // Optional profile details; users can complete these later.
    heightCm: { type: Number, min: 50, max: 300 },
    weightKg: { type: Number, min: 1, max: 500 },
    age: { type: Number, min: 13, max: 120 },
    gender: { type: String, enum: ["female", "male", "other", "prefer-not-to-say"] },
    fitnessGoal: {
      type: String,
      enum: ["weight-loss", "weight-gain", "strength", "general-fitness"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);