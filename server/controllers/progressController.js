const Meal = require('../models/Meal');
const Workout = require('../models/Workout');
const Weight = require('../models/Weight');

// GET /api/progress/weekly  -> last 7 din ka din-wise consumed vs burned
exports.weekly = async (req, res) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    const range = { $gte: start, $lt: end };

    const meals = await Meal.find({ user: req.userId, date: range });
    const workouts = await Workout.find({ user: req.userId, date: range });
    days.push({
      label: start.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
      consumed: meals.reduce((s, m) => s + m.calories, 0),
      burned: workouts.reduce((s, w) => s + w.caloriesBurned, 0)
    });
  }
  res.json(days);
};

exports.addWeight = async (req, res) => {
  const { weight } = req.body;
  if (!(weight > 0)) return res.status(400).json({ message: 'Enter valid weight' });
  res.status(201).json(await Weight.create({ user: req.userId, weight }));
};

exports.getWeights = async (req, res) =>
  res.json(await Weight.find({ user: req.userId }).sort('date'));