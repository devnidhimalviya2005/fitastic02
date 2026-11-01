
const router = require('express').Router();
const auth = require('../middleware/auth');
const { getWeights, addWeight, deleteWeight } = require('../controllers/weightController');

router.get('/', auth, getWeights);
router.post('/', auth, addWeight);
router.delete('/:id', auth, deleteWeight);

module.exports = router;