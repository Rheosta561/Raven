const express = require('express');
const sendNotificationController = require('../Controllers/sendNotificationController');
const router= express.Router();

router.post('/test', sendNotificationController.notifyAllUsers);

module.exports = router;