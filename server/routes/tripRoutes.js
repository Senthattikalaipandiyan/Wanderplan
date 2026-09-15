const express = require('express');
const router = express.Router();
const {
  getMyTrips, getTripById, createTrip,
  updateTrip, deleteTrip, addItineraryDay,
  approveTrip, assignManager
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

// All trip routes require authentication
router.use(protect);

router.route('/')
  .get(restrictTo('traveler', 'manager', 'admin'), getMyTrips)
  .post(restrictTo('traveler'), createTrip);

router.route('/:id')
  .get(getTripById)
  .put(restrictTo('traveler', 'manager', 'admin'), updateTrip)
  .delete(restrictTo('traveler', 'admin'), deleteTrip);

router.post('/:id/itinerary', restrictTo('traveler', 'manager', 'admin'), addItineraryDay);

router.put('/:id/approve', restrictTo('admin'), approveTrip);
router.put('/:id/assign-manager', restrictTo('admin'), assignManager);

module.exports = router;

