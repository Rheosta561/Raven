const { fetchGoogleNews } = require("./fetchGoogleNews");
const { fetchLocation } = require("./fetchLocation");
const { fetchYouTubeVideo } = require("./fetchYouTube");
const Feed = require('../Models/feedSchema');
const { generateTagsFromTitle } = require("./generateTags");

const fetchFeed = async (lat, long) => {
  try {
    const location = await fetchLocation(lat, long);
    const address = location.address;

    const locationKeyword =
      location.name?.trim() ||
      address.neighbourhood ||
      address.city_district ||
      address.city ||
      address.state ||
      address.country;

      // searching the news based on the location keyword 
    const foundNews = await fetchGoogleNews(`latest news of ${locationKeyword}`);
    const limitedNews = foundNews; 

    // fetching the youtube videos and tags for each news item
    const feedPromises = limitedNews.map(async (news) => {
      const [videos, tags] = await Promise.all([
        fetchYouTubeVideo(news.title),        
        generateTagsFromTitle(news.title)     
      ]);

      // returning the feed object with the required properties
      return {
        title: news.title,
        description: news.description || news.title,
        tags: tags,
        type: 'news',
        videoUri: videos[0]?.url || '',
        location: {
          latitude: lat,
          longitude: long
        },
        link: news.link,
        priority: 'medium'
      };
    });

    const feeds = await Promise.all(feedPromises);
    await Feed.insertMany(feeds);


    return feeds;

  } catch (error) {
    console.error(' Error in fetchFeed:', error.message);
    throw error;
  }
};

module.exports = { fetchFeed };
