const express = require("express");
const router = express.Router();
const Meal = require("../models/Meal");
const requireAuth = require("../middleware/auth");

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const meals = await Meal.find({ userId: req.userId }).sort({ date: -1 });
    res.json(meals);
  } catch {
    res.status(500).json({ message: "Could not load meals." });
  }
});

router.post("/", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const mealType = req.body.mealType;
    const calories = Number(req.body.calories);
    const date = req.body.date ? new Date(req.body.date) : new Date();

    if (!name || name.length > 100) {
      return res.status(400).json({ message: "Enter a meal name (up to 100 characters)." });
    }

    if (!["breakfast", "lunch", "dinner", "snack"].includes(mealType)) {
      return res.status(400).json({ message: "Choose a valid meal type." });
    }

    if (!Number.isFinite(calories) || calories < 0 || calories > 10000) {
      return res.status(400).json({ message: "Calories must be between 0 and 10,000." });
    }

    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({ message: "Enter a valid date." });
    }

    const meal = await Meal.create({
      userId: req.userId,
      name,
      mealType,
      calories,
      date,
    });

    res.status(201).json(meal);
  } catch {
    res.status(500).json({ message: "Could not save the meal." });
  }
});

module.exports = router;