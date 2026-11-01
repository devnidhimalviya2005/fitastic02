
const router = require('express').Router();
const auth = require('../middleware/auth');
const { weekly } = require('../controllers/progressController');

router.get('/weekly', auth, weekly);

module.exports = router;