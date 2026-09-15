const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    groupTrip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GroupTrip',
      required: true,
    },
    dateTime: { type: Date, required: true },
    location: { type: String, default: '' },
    duration: { type: String, default: '' },
    assignedTo: { type: String, default: 'All Travelers' }, // "All" or group label
    cost: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
