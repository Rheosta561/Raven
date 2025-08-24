const express = require('express');
const router = express.Router();
const feedController = require('../Controllers/feedController');
const { upload } = require('../Configs/cloudinary');
const { handleCreateFeed } = require('../Controllers/uploadController');


// creating single and batch feeds
router.post('/feed/single', feedController.createSingleFeed);
router.post('/feed/batch', feedController.createBatchFeeds);

//status : working
router.get('/feed', feedController.getFeedsPaginated);

// status : working
router.post('/create' , upload, handleCreateFeed);

module.exports = router;
