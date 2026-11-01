const Meal = require('../models/Meal');
const Food = require('../models/Food');

exports.getFoods = async (req, res) => res.json(await Food.find().sort('name'));

exports.addMeal = async (req, res) => {
  try {
    const { foodId, quantity, category } = req.body;
    if (!foodId || !(quantity > 0))
      return res.status(400).json({ message: 'Select food and enter quantity' });
    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: 'Food not found' });

    const meal = await Meal.create({
      user: req.userId,
      foodName: food.name,
      category,
      quantity,
      calories: Math.round(food.calories * quantity)
    });
    res.status(201).json(meal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/meals?date=2026-10-28  (date nahi diya to aaj)
exports.getMeals = async (req, res) => {
  const day = req.query.date ? new Date(req.query.date) : new Date();
  const start = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  const end = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
  const meals = await Meal.find({ user: req.userId, date: { $gte: start, $lt: end } });
  const total = meals.reduce((sum, m) => sum + m.calories, 0);
  res.json({ meals, total });
};

exports.deleteMeal = async (req, res) => {
  await Meal.deleteOne({ _id: req.params.id, user: req.userId });
  res.json({ message: 'Deleted' });
};