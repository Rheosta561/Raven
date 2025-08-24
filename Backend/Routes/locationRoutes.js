const express = require('express');
const { fetchUserLocation } = require('../Controllers/LocationController');

const router = express.Router();
router.post('/fetch', fetchUserLocation);

module.exports = router;