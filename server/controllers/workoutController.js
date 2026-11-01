const Workout = require('../models/Workout');
const User = require('../models/User');
const activities = require('../data/activities.json');

exports.getActivities = (req, res) => res.json(activities);

exports.addWorkout = async (req, res) => {
  try {
    const { activity, duration, distance } = req.body;
    const found = activities.find((a) => a.name === activity);
    if (!found || !(duration > 0))
      return res.status(400).json({ message: 'Choose activity and enter duration' });

    const user = await User.findById(req.userId);
    const weight = user.weight || 60;
    const caloriesBurned = Math.round(found.met * weight * (duration / 60));

    const w = await Workout.create({
      user: req.userId, activity, duration, distance, caloriesBurned
    });
    res.status(201).json(w);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWorkouts = async (req, res) => {
  const list = await Workout.find({ user: req.userId }).sort('-date').limit(50);
  res.json(list);
};

exports.deleteWorkout = async (req, res) => {
  await Workout.deleteOne({ _id: req.params.id, user: req.userId });
  res.json({ message: 'Deleted' });
};