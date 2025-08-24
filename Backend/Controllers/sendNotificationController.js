const sendNotification = require('../Utils/sendNotification');
const User = require('../Models/User');

const notifyAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    for (const user of users) {
      await sendNotification.sendNotification({
        userId: user._id,
        message: 'Test notification',
        type: 'alert',
        priority: 1
      });
    }

    res.status(200).json({ message: 'All users notified successfully' });
  } catch (error) {
    console.error('Notification error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports={notifyAllUsers};