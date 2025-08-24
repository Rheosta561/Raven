const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const authController = require('../Controllers/AuthController');
const { handleUserUpdate } = require('../Controllers/uploadController');
const { upload } = require('../Configs/cloudinary');
router.post('/login' , authController.login);
router.post('/signup', authController.createAccount);
router.post('/update/:userId', upload, handleUserUpdate);
router.post('/store-token', async (req, res) => {
  const { userId, pushToken } = req.body;
  await User.findByIdAndUpdate(userId, { pushToken });
  res.json({ success: true });
});


module.exports = router;