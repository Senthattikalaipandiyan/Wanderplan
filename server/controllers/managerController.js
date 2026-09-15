const GroupTrip = require('../models/GroupTrip');
const Activity = require('../models/Activity');
const User = require('../models/User');

// ─── GET /api/manager/group-trips ────────────────────────
exports.getGroupTrips = async (req, res) => {
  try {
    const trips = await GroupTrip.find({ manager: req.user._id })
      .populate('travelers', 'name email')
      .sort({ startDate: 1 });
    res.json({ success: true, count: trips.length, trips });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/manager/group-trips ───────────────────────
exports.createGroupTrip = async (req, res) => {
  try {
    const trip = await GroupTrip.create({ ...req.body, manager: req.user._id });
    res.status(201).json({ success: true, trip });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PUT /api/manager/group-trips/:id ────────────────────
exports.updateGroupTrip = async (req, res) => {
  try {
    const trip = await GroupTrip.findOneAndUpdate(
      { _id: req.params.id, manager: req.user._id },
      req.body,
      { new: true }
    );
    if (!trip) return res.status(404).json({ success: false, message: 'Group trip not found.' });
    res.json({ success: true, trip });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE /api/manager/group-trips/:id ─────────────────
exports.deleteGroupTrip = async (req, res) => {
  try {
    await GroupTrip.findOneAndDelete({ _id: req.params.id, manager: req.user._id });
    res.json({ success: true, message: 'Group trip deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/manager/group-trips/:id/travelers ─────────
// Add a traveler to a group trip
exports.addTraveler = async (req, res) => {
  try {
    const { userId } = req.body;
    const trip = await GroupTrip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });

    if (trip.travelers.includes(userId)) {
      return res.status(400).json({ success: false, message: 'Traveler already in this trip.' });
    }

    trip.travelers.push(userId);
    await trip.save();
    res.json({ success: true, trip });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE /api/manager/group-trips/:id/travelers/:userId
exports.removeTraveler = async (req, res) => {
  try {
    const trip = await GroupTrip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });

    trip.travelers = trip.travelers.filter(
      (t) => t.toString() !== req.params.userId
    );
    await trip.save();
    res.json({ success: true, trip });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/manager/activities ─────────────────────────
exports.getActivities = async (req, res) => {
  try {
    // Get activities for all group trips managed by this user
    const myTrips = await GroupTrip.find({ manager: req.user._id }).select('_id');
    const tripIds = myTrips.map((t) => t._id);
    const activities = await Activity.find({ groupTrip: { $in: tripIds } })
      .populate('groupTrip', 'name destination')
      .sort({ dateTime: 1 });
    res.json({ success: true, activities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/manager/activities ────────────────────────
exports.createActivity = async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    // Add activity reference to the group trip
    await GroupTrip.findByIdAndUpdate(req.body.groupTrip, {
      $push: { activities: activity._id },
    });
    res.status(201).json({ success: true, activity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/manager/travelers ──────────────────────────
// Get all travelers under this manager's trips
exports.getManagedTravelers = async (req, res) => {
  try {
    const trips = await GroupTrip.find({ manager: req.user._id })
      .populate('travelers', 'name email phone createdAt');
    const travelerMap = {};
    trips.forEach((trip) => {
      trip.travelers.forEach((t) => {
        travelerMap[t._id] = { ...t.toObject(), groupTrip: trip.name };
      });
    });
    res.json({ success: true, travelers: Object.values(travelerMap) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
