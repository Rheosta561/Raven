const Feed = require('../Models/feedSchema');
const { fetchFeed } = require('../Utils/fetchFeed');
const { fetchGoogleNews } = require('../Utils/fetchGoogleNews');
const { fetchLocation } = require('../Utils/fetchLocation');


exports.createSingleFeed = async (req, res) => {
  try {
    const feed = new Feed(req.body);
    await feed.save();
    res.status(201).json({ success: true, message: 'Feed created', feed });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating feed', error });
  }
};


exports.createBatchFeeds = async (req, res) => {
  try {
    const feeds = await Feed.insertMany(req.body); 
    res.status(201).json({ success: true, message: 'Feeds created', feeds });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating batch feeds', error });
  }
};


exports.getFeedsPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const lat = parseFloat(req.query.lat);
    const long = parseFloat(req.query.long);

    // only for testing 
    const feeds = await Feed.find(); // Fetch from DB without sorting





    const total = await Feed.countDocuments();
    let fetchedFeeds = [];
    if(!isNaN(lat) && !isNaN(long)){
        fetchedFeeds= await fetchFeed(lat , long);
    }

    const mergedFeeds = [...fetchedFeeds , ...feeds];
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    mergedFeeds.sort((a, b) => {
      const pA = priorityOrder[a.priority] ?? 3;
      const pB = priorityOrder[b.priority] ?? 3;
      if (pA !== pB) return pA - pB;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    console.log("Fetched Feeds number:", mergedFeeds.splice(0, 10).length); // Log first 10 feeds for debugging

    res.status(200).json({
      success: true,
      feeds:mergedFeeds,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },

    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error fetching feeds', error });
  }
};
