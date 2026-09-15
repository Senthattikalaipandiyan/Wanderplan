const express = require('express');
const router = express.Router();
const {
  getAllUsers, createUser, updateUser, deleteUser,
  getAnalytics,
  getDestinations, createDestination, updateDestination, deleteDestination,
  getAllBookings, updateBookingStatus,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(restrictTo('admin'));

// Users
router.route('/users').get(getAllUsers).post(createUser);
router.route('/users/:id').put(updateUser).delete(deleteUser);

// Analytics
router.get('/analytics', getAnalytics);

// Destinations
router.route('/destinations').get(getDestinations).post(createDestination);
router.route('/destinations/:id').put(updateDestination).delete(deleteDestination);

// Bookings
router.get('/bookings', getAllBookings);
router.put('/bookings/:id', updateBookingStatus);

module.exports = router;
