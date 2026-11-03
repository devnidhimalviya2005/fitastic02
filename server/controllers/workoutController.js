
const Workout = require('../models/Workout');
const User = require('../models/User');
const activities = require('../data/activities.json');

// Get all available exercises
exports.getActivities = (req, res) => {
  res.json(activities);
};

// Add workout
exports.addWorkout = async (req, res) => {
  try {
    const {
      activity,
      customActivity,
      duration,
      distance,
      intensity,
    } = req.body;

    const selectedActivity = activities.find(
      (item) => item.name === activity
    );

    const isCustom = activity === 'Other';

    // Validate exercise
    if (!selectedActivity && !isCustom) {
      return res.status(400).json({
        message: 'Please select a valid exercise',
      });
    }

    // Validate custom exercise name
    if (
      isCustom &&
      (!customActivity || !customActivity.trim())
    ) {
      return res.status(400).json({
        message: 'Please enter your exercise name',
      });
    }

    // Validate duration
    const minutes = Number(duration);

    if (
      !Number.isFinite(minutes) ||
      minutes < 1 ||
      minutes > 600
    ) {
      return res.status(400).json({
        message: 'Duration must be between 1 and 600 minutes',
      });
    }

    // Validate distance
    const km = distance === undefined || distance === ''
      ? 0
      : Number(distance);

    if (!Number.isFinite(km) || km < 0) {
      return res.status(400).json({
        message: 'Enter a valid distance',
      });
    }

    // Validate intensity for custom exercise
    const allowedIntensity = ['light', 'moderate', 'vigorous'];

    if (
      isCustom &&
      !allowedIntensity.includes(intensity)
    ) {
      return res.status(400).json({
        message: 'Please select exercise intensity',
      });
    }

    // Get user's weight
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const weight = Number(user.weight) || 60;

    // MET estimate
    let met;

    if (selectedActivity) {
      met = selectedActivity.met;
    } else {
      const intensityMET = {
        light: 2.5,
        moderate: 4,
        vigorous: 6,
      };

      met = intensityMET[intensity];
    }

    // Calories estimation
    const caloriesBurned = Math.round(
      met * weight * (minutes / 60)
    );

    // Save workout
    const workout = await Workout.create({
      user: req.userId,
      activity: isCustom ? 'Other' : activity,
      customActivity: isCustom
        ? customActivity.trim()
        : '',
      intensity: intensity || 'moderate',
      duration: minutes,
      distance: km,
      caloriesBurned,
    });

    res.status(201).json({
      message: 'Workout added successfully',
      workout,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get user's workout history
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({
      user: req.userId,
    })
      .sort({ date: -1 })
      .limit(50);

    res.status(200).json(workouts);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete workout
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!workout) {
      return res.status(404).json({
        message: 'Workout not found',
      });
    }

    res.status(200).json({
      message: 'Workout deleted successfully',
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
