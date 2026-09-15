const Trip = require('../models/Trip');

// ─── GET /api/trips ───────────────────────────────────────
exports.getMyTrips = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'traveler') filter.traveler = req.user._id;
    else if (req.user.role === 'manager') filter.managerId = req.user._id;
    
    const trips = await Trip.find(filter)
      .populate('traveler', 'name email')
      .populate('managerId', 'name email')
      .sort({ startDate: -1 });
      
    res.json({ success: true, count: trips.length, trips });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/trips/:id ───────────────────────────────────
exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('traveler', 'name email');

    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });

    // Ensure owner, admin, or assigned manager can view
    if (
      trip.traveler._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      !(req.user.role === 'manager' && trip.managerId && trip.managerId.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this trip.' });
    }

    res.json({ success: true, trip });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/trips ──────────────────────────────────────
exports.createTrip = async (req, res) => {
  try {
    const { destination, country, startDate, endDate, budget, notes, coverEmoji } = req.body;

    const trip = await Trip.create({
      traveler: req.user._id,
      destination,
      country,
      startDate,
      endDate,
      budget,
      notes,
      coverEmoji: coverEmoji || '✈️',
    });

    res.status(201).json({ success: true, trip });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PUT /api/trips/:id ───────────────────────────────────
exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });

    const isOwner = trip.traveler.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isManager = req.user.role === 'manager' && trip.managerId && trip.managerId.toString() === req.user._id.toString();

    if (!isOwner && !isAdmin && !isManager) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const updated = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, trip: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE /api/trips/:id ────────────────────────────────
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });

    if (trip.traveler.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    await trip.deleteOne();
    res.json({ success: true, message: 'Trip deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/trips/:id/itinerary ───────────────────────
// Add a day to the itinerary
exports.addItineraryDay = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });

    trip.itinerary.push(req.body);
    await trip.save();

    res.json({ success: true, trip });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PUT /api/trips/:id/approve ───────────────────────────
exports.approveTrip = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can approve trips.' });
    }

    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });

    trip.status = 'Approved';
    await trip.save();

    res.json({ success: true, message: 'Trip approved successfully.', trip });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PUT /api/trips/:id/assign-manager ────────────────────
exports.assignManager = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can assign managers.' });
    }

    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });

    const { managerId } = req.body;
    if (!managerId) return res.status(400).json({ success: false, message: 'Manager ID is required.' });

    trip.managerId = managerId;
    await trip.save();

    res.json({ success: true, message: 'Manager assigned successfully.', trip });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
