const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  ravenPoints: {
    type: Number, // raven points for the request fulfillment to be alloted by team raven 
    default: 0,
  },
  registeredCount: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    enum: ['request', 'news'],
    default: 'request',
  },
  imageUri: {
    type: String,
    default: '',
  },
  videoUri: {
    type: String,
    default: '',
  },
  location: {
    type: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    required: true
  },
  link:{
    type:String
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Feed', feedSchema);
