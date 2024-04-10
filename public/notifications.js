const EventEmitter = require('events');

class NotificationManager extends EventEmitter {
  createNotification(notificationData) {
    console.log('Saving notification to the database:', notificationData);
    
    this.emit('new_notification', notificationData);
  }
}

class UserNotificationService {
  constructor(notificationManager) {
    notificationManager.on('new_notification', this.update);
  }

  update(notificationData) {
    console.log('Notifying user about:', notificationData);
  }
}

// Usage
const notificationManager = new NotificationManager();
new UserNotificationService(notificationManager);

notificationManager.createNotification({
  userId: 'user_id_here',
  type: 'booking_request',
  message: 'Your booking request has been received.',
  status: 'new',
});
