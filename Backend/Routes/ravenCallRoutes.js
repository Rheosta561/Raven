const express = require('express');
const router = express.Router();
const {ravenCallHandler} = require('../Controllers/ravenCallController');
router.post('/call' , ravenCallHandler );

module.exports = router;