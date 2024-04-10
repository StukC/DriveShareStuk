const mongoose = require('mongoose');
const EventEmitter = require('events');

// Define the schema
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['booking_request', 'booking_confirmation', 'message', 'system_update'],
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    enum: ['new', 'seen'],
    default: 'new',
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

// class extends eventemitter to act as notification manager
class NotificationManager extends EventEmitter {
  async createNotification(userId, type, message) {
    try {
      const notification = new Notification({ userId, type, message });
      const savedNotification = await notification.save();

      // Notify all observers about new notification
      this.emit('notification', savedNotification);
      console.log('Notification created and observers notified.');
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }
}

// Export instance
module.exports = new NotificationManager();
