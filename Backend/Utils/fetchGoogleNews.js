const axios = require('axios');
const cheerio = require('cheerio');

const fetchGoogleNews = async (query) => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-IN&gl=IN&ceid=IN:en`;

    const response = await axios.get(url);
    const $ = cheerio.load(response.data, { xmlMode: true });

    const newsItems = [];

    $('item').each((i, el) => {
      const title = $(el).find('title').text();
      const link = $(el).find('link').text();
      const pubDate = $(el).find('pubDate').text();

      newsItems.push({ title, link, pubDate });
    });

    return newsItems; 
  } catch (error) {
    console.error('Error fetching the news:', error.message);
    return [];
  }
};

module.exports = { fetchGoogleNews };
