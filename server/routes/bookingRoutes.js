const express = require('express');
const router = express.Router();
const { getMyBookings, createBooking, updateBooking, deleteBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .get(restrictTo('traveler', 'admin'), getMyBookings)
  .post(restrictTo('traveler'), createBooking);

router.route('/:id')
  .put(restrictTo('traveler'), updateBooking)
  .delete(restrictTo('traveler'), deleteBooking);

module.exports = router;
