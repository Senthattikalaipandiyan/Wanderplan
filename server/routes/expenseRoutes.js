const express = require('express');
const router = express.Router();
const { getExpenses, addExpense, updateExpense, deleteExpense, getExpenseSummary } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .get(restrictTo('traveler', 'manager', 'admin'), getExpenses)
  .post(restrictTo('traveler', 'manager', 'admin'), addExpense);

router.get('/summary', restrictTo('traveler', 'manager', 'admin'), getExpenseSummary);
router.put('/:id', restrictTo('traveler', 'manager', 'admin'), updateExpense);
router.delete('/:id', restrictTo('traveler', 'manager', 'admin'), deleteExpense);

module.exports = router;
