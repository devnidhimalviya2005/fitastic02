const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    // Sirf ye fields badal sakte hain (password / email nahi)
    const { name, age, height, weight, calorieTarget } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.userId,
      { name, age, height, weight, calorieTarget },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};