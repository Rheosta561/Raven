const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['info', 'alert', 'emergency', 'honor', 'system'], 
    default: 'info' 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  link: {
    type: String, 
    default: ''
  },
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  priority: {
    type: Number,
    default: 1  
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Notification', NotificationSchema);
