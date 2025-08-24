// status : working 

const jwt = require('jsonwebtoken');
const { getIo, onlineUsers } = require('../socket');
const User = require('../Models/User');
const { sendNotification } = require('../Utils/sendNotification');

const MAX_RADIUS_KM = 20; // 5 km radius for nearby users

const ALERT_SECRET = process.env.ALERT_SECRET;


function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = angle => (angle * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// alert token only valid for 5 minutes 
function generateAlertToken(payload) {
  return jwt.sign(payload, ALERT_SECRET, { expiresIn: '5m' });
}

const ravenCallHandler = async (req, res) => {
  try {
    console.log('Raven Call Initiated with body:', req.body);
    const { user, latitude, longitude, message = 'Emergency Raven Call near your area!' } = req.body;

    if (!user || !latitude || !longitude) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const allUsers = await User.find();

    const nearbyUsers = allUsers.filter(u => {
      if (!u.location?.latitude || !u.location?.longitude) return false;
      if (u._id.toString() === user._id.toString()) return false;

      const dist = calculateDistance(latitude, longitude, u.location.latitude, u.location.longitude);
      return dist <= MAX_RADIUS_KM;
    });

    const io = getIo();

    for (const targetUser of nearbyUsers) {
      const alertToken = generateAlertToken({
        targetUser: targetUser,
        location: { latitude, longitude },
        issuedBy: user,
        message,
        type: 'ravenCall'
      });

      const notificationPayload = {
        userId: targetUser,
        message,
        type: 'alert',
        alertToken,
        location: { latitude, longitude },
        priority: 2
      };
      console.log('online Users ' ,onlineUsers);

      const socketId = onlineUsers.get(targetUser._id.toString());
      console.log(`Socket ID for ${targetUser._id}:`, socketId);

      if (socketId) {
        io.to(socketId).emit('ravenCall', notificationPayload);
        io.to(socketId).emit('notification', notificationPayload);
        console.log(`Sent Raven Call to online user ${targetUser.name}`);
      } else {
        await sendNotification(notificationPayload); 
        console.log(`Email/push sent to offline user ${targetUser.name}`);
      }
    }

    return res.status(200).json({ message: 'AlertTokens sent to nearby users.' });
  } catch (error) {
    console.error('Raven Call error:', error.message);
    return res.status(500).json({ error: 'Failed to broadcast Raven Call' });
  }
};

module.exports = { ravenCallHandler };
