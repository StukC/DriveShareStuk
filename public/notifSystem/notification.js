// EmailService.js
const Observer = require('./Observer');

class Notification extends Observer {
  update(data) {
    sendEmail(data.userEmail, data.message).catch(console.error);
  }
}

async function sendEmail(to, content) {
  // Logic to send email notifications
  console.log(`Email sent to ${to}: ${content}`);
}

module.exports = EmailService;

// InAppNotificationService.js
const Observer = require('./Observer');

class InAppNotificationService extends Observer {
  update(data) {
    showInAppNotification(data.userId, data.message).catch(console.error);
  }
}

async function showInAppNotification(userId, content) {
  // Logic to show an in-app message
  console.log(`In-app notification for ${userId}: ${content}`);
}

module.exports = InAppNotificationService;


// //In your app.js (or wherever your main application setup occurs), you would require and use these modules as demonstrated earlier.

// const BookingNotifier = require('./observers/BookingNotifier');
// const EmailService = require('./observers/EmailService');
// const InAppNotificationService = require('./observers/InAppNotificationService');

// // Instantiate concrete observers if necessary
// const emailServiceInstance = new EmailService();
// const inAppNotificationServiceInstance = new InAppNotificationService();

// // Subscribe your observers
// BookingNotifier.subscribe(emailServiceInstance);
// BookingNotifier.subscribe(inAppNotificationServiceInstance);

// // ...rest of your app setup