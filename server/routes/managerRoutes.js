const express = require('express');
const router = express.Router();
const {
  getGroupTrips, createGroupTrip, updateGroupTrip, deleteGroupTrip,
  addTraveler, removeTraveler,
  getActivities, createActivity,
  getManagedTravelers,
} = require('../controllers/managerController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(restrictTo('manager'));

router.route('/group-trips')
  .get(getGroupTrips)
  .post(createGroupTrip);

router.route('/group-trips/:id')
  .put(updateGroupTrip)
  .delete(deleteGroupTrip);

router.post('/group-trips/:id/travelers', addTraveler);
router.delete('/group-trips/:id/travelers/:userId', removeTraveler);

router.route('/activities')
  .get(getActivities)
  .post(createActivity);

router.get('/travelers', getManagedTravelers);

module.exports = router;
