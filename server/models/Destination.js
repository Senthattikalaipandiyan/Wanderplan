const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true },
    category: {
      type: String,
      enum: ['beach', 'mountain', 'city', 'cultural', 'adventure', 'luxury', 'wildlife'],
      required: true,
    },
    description: { type: String, default: '' },
    bestTime: { type: String, default: '' },
    avgCost: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5, min: 1, max: 5 },
    emoji: { type: String, default: '🌍' },
    isActive: { type: Boolean, default: true },
    visitCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Destination', destinationSchema);
