const Notification = require('../Models/Notification');
const { onlineUsers, getIo } = require('../socket');
const emailService = require('./emailService');
const User = require('../Models/User');
const {Expo} = require('expo-server-sdk');
const expo = new Expo();


const sendNotification = async ({
  userId,
  message,
  type = 'info',
  link = '',
  location = null,
  priority = 1,
}) => {
  try {
    const user = await User.findById(userId);
    if (!user) return console.warn('User not found for notification');

    const notification = new Notification({
      userId: user._id,
      message,
      type,
      link,
      location,
      priority,
    });
    await notification.save();

    
    const socketId = onlineUsers.get(user._id.toString());
    if (socketId) {
      const io = getIo();
      io.to(socketId).emit('notification', notification);
      console.log(`Notification sent to online user ${user.name}`);
      return;
    }
    if (user.pushToken && Expo.isExpoPushToken(user.pushToken)) {
      await expo.sendPushNotificationsAsync([{
        to: user.pushToken,
        sound: 'default',
        title: 'Alert from Preacher Clan',
        body: message,
        data: { link },
      }]);
      console.log(`Expo push sent to ${user.name}`);
      return;
    }

    // Fallback to email if user is offline
    const html = generateNotificationEmail(user.name, message, link);
    await emailService.sendEmail(user.email, 'You Have a New Notification', html);
    console.log(`Notification emailed to ${user.email}`);

  } catch (error) {
    console.error('Failed to send notification:', error.message);
  }
};

function generateNotificationEmail(name, message, link) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; background: #f9f9f9; }
      .container { max-width: 600px; margin: 20px auto; padding: 20px; background: #fff; border-radius: 10px; }
      .header { background: #000; padding: 15px; color: white; text-align: center; }
      .title { font-size: 1.4rem; color: #ba047e; margin-top: 20px; }
      .message { font-size: 1rem; margin: 20px 0; }
      .link-button { padding: 10px 20px; background: #ba047e; color: white; text-decoration: none; border-radius: 5px; }
      .footer { font-size: 0.8rem; text-align: center; color: #999; margin-top: 30px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Preacher Clan Notification</h2>
      </div>
      <div class="title">Hello ${name},</div>
      <div class="message">${message}</div>
      ${link ? `<div style="text-align:center;"><a href="${link}" class="link-button">View Details</a></div>` : ''}
      <div class="footer">Thank you for staying alert with Preacher Clan.</div>
    </div>
  </body>
  </html>`;
}

module.exports = {
  sendNotification,
};
