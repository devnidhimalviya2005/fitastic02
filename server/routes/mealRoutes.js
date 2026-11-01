
const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/mealController');

router.get('/foods', auth, c.getFoods);
router.get('/', auth, c.getMeals);
router.post('/', auth, c.addMeal);
router.delete('/:id', auth, c.deleteMeal);
module.exports = router;