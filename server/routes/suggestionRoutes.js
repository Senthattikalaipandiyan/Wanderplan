const express = require('express');
const router = express.Router();
const { addSuggestion, getSuggestions } = require('../controllers/suggestionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', addSuggestion);
router.get('/:tripId', getSuggestions);

module.exports = router;
