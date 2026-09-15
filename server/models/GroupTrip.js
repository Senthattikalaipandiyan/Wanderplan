const mongoose = require('mongoose');

const groupTripSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Trip name is required'] },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    destination: { type: String, required: true },
    country: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    maxTravelers: { type: Number, default: 20 },
    travelers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
      },
    ],
    totalBudget: { type: Number, default: 0 },
    spentAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['planning', 'active', 'completed', 'cancelled'],
      default: 'planning',
    },
    itinerary: [
      {
        day: Number,
        date: Date,
        title: String,
        description: String,
        assignedTo: { type: String, default: 'All Travelers' },
      },
    ],
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GroupTrip', groupTripSchema);
