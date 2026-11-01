const Weight = require('../models/Weight');

exports.getWeights = async (req, res) => {
  res.json(await Weight.find({ user: req.userId }).sort('date'));
};

exports.addWeight = async (req, res) => {
  try {
    const { weight, date } = req.body;
    if (!(weight > 20 && weight < 300))
      return res.status(400).json({ message: 'Enter a valid weight in kg' });
    const entry = await Weight.create({ user: req.userId, weight, date: date || Date.now() });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteWeight = async (req, res) => {
  await Weight.deleteOne({ _id: req.params.id, user: req.userId });
  res.json({ message: 'Deleted' });
};