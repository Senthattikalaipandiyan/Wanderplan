const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  time: { type: String },
  startTime: { type: String },
  endTime: { type: String },
  title: { type: String, required: true },
  description: { type: String },
  notes: { type: String },
  location: { type: String },
  lastUpdated: { type: Date, default: null },
});

const daySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  date: { type: Date },
  activities: [activitySchema],
});

const tripSchema = new mongoose.Schema(
  {
    traveler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    destination: { type: String, required: [true, 'Destination is required'] },
    country: { type: String, required: [true, 'Country is required'] },
    startDate: { type: Date, required: [true, 'Start date is required'] },
    endDate: { type: Date, required: [true, 'End date is required'] },
    budget: { type: Number, required: [true, 'Budget is required'], min: 0 },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['Pending Approval', 'Approved', 'planning', 'upcoming', 'ongoing', 'completed'],
      default: 'Pending Approval',
    },
    itinerary: [daySchema],
    notes: { type: String, default: '' },
    coverEmoji: { type: String, default: '✈️' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);
