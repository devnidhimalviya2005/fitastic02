const express = require("express");
const router = express.Router();
const Workout = require("../models/workout");
const requireAuth = require("../middleware/auth");

// Approximate MET values; calorie results are estimates.
const activityMETs = {
  walking: { light: 2.5, moderate: 3.5, vigorous: 4.5 },
  running: { light: 6, moderate: 8.3, vigorous: 11.5 },
  cycling: { light: 4, moderate: 7.5, vigorous: 10 },
  swimming: { light: 4, moderate: 6, vigorous: 9 },
  strength: { light: 2.5, moderate: 3.5, vigorous: 6 },
  other: { light: 2.5, moderate: 4, vigorous: 6 },
};

router.use(requireAuth);

router.post("/", async (req, res) => {
  try {
    const {
      activity,
      customActivity = "",
      intensity,
      durationMinutes,
      weightKg,
    } = req.body;

    if (!activityMETs[activity]) {
      return res.status(400).json({ message: "Choose a valid activity." });
    }

    if (!["light", "moderate", "vigorous"].includes(intensity)) {
      return res.status(400).json({ message: "Choose a valid intensity." });
    }

    const duration = Number(durationMinutes);
    const weight = Number(weightKg);
    const cleanCustomActivity = String(customActivity).trim();

    if (!Number.isFinite(duration) || duration < 1 || duration > 600) {
      return res.status(400).json({
        message: "Duration must be between 1 and 600 minutes.",
      });
    }

    if (!Number.isFinite(weight) || weight < 1 || weight > 500) {
      return res.status(400).json({
        message: "Weight must be between 1 and 500 kg.",
      });
    }

    if (activity === "other" && !cleanCustomActivity) {
      return res.status(400).json({ message: "Enter a name for your activity." });
    }

    if (cleanCustomActivity.length > 80) {
      return res.status(400).json({
        message: "Activity name must be 80 characters or fewer.",
      });
    }

    const met = activityMETs[activity][intensity];
    const caloriesBurned = Math.round((met * 3.5 * weight * duration) / 200);

    const workout = await Workout.create({
      userId: req.userId,
      activity,
      customActivity: activity === "other" ? cleanCustomActivity : "",
      intensity,
      durationMinutes: duration,
      weightKg: weight,
      caloriesBurned,
    });

    return res.status(201).json(workout);
  } catch (error) {
    return res.status(500).json({ message: "Could not save the workout." });
  }
});

router.get("/", async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.userId }).sort({ date: -1 });
    return res.json(workouts);
  } catch {
    return res.status(500).json({ message: "Could not load workouts." });
  }
});

module.exports = router;