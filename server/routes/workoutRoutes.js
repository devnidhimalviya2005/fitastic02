
const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  getActivities,
  getWorkouts,
  addWorkout,
  deleteWorkout,
} = require('../controllers/workoutController');

router.get('/activities', auth, getActivities);
router.get('/', auth, getWorkouts);
router.post('/', auth, addWorkout);
router.delete('/:id', auth, deleteWorkout);

module.exports = router;