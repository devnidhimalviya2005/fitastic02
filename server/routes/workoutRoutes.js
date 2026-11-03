
const router = require('express').Router();

const auth = require('../middleware/auth');

const {
  getActivities,
  getWorkouts,
  addWorkout,
  deleteWorkout,
} = require('../controllers/workoutController');

// Get exercise options
router.get('/activities', auth, getActivities);

// Get workout history
router.get('/', auth, getWorkouts);

// Add workout
router.post('/', auth, addWorkout);

// Delete workout
router.delete('/:id', auth, deleteWorkout);

module.exports = router;
