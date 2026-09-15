const Suggestion = require('../models/Suggestion');
const Trip = require('../models/Trip');

exports.addSuggestion = async (req, res) => {
  try {
    const { tripId, message } = req.body;
    if (!tripId || !message) return res.status(400).json({ success: false, message: 'tripId and message required.' });

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });

    if (req.user.role !== 'manager' || trip.managerId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only assigned manager can suggest.' });
    }

    const suggestion = await Suggestion.create({
      tripId,
      managerId: req.user._id,
      message,
    });

    res.status(201).json({ success: true, suggestion });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });

    const suggestions = await Suggestion.find({ tripId }).sort({ createdAt: -1 });
    res.json({ success: true, suggestions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
