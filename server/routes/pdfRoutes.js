const express = require('express');
const router = express.Router();
const { generatePDF } = require('../controllers/pdfController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/:id', generatePDF);

module.exports = router;
