const axios = require('axios');

const fetchYouTubeVideo = async (query) => {
  try {
    const encoded = encodeURIComponent(query);
    const url = `https://www.youtube.com/results?search_query=${encoded}+news`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });


    const html = response.data;
    const initialDataStart = html.indexOf('var ytInitialData = ') + 20;
    const initialDataEnd = html.indexOf(';</script>', initialDataStart);
    const jsonData = html.slice(initialDataStart, initialDataEnd);

    const data = JSON.parse(jsonData);

    const videoContents = data.contents
      ?.twoColumnSearchResultsRenderer
      ?.primaryContents
      ?.sectionListRenderer
      ?.contents?.[0]
      ?.itemSectionRenderer
      ?.contents;

    const videos = [];

    if (videoContents) {
      for (const item of videoContents) {
        if (item.videoRenderer) {
          const video = item.videoRenderer;
          videos.push({
            title: video.title.runs[0].text,
            videoId: video.videoId,
            url: `https://www.youtube.com/watch?v=${video.videoId}`,
            thumbnail: video.thumbnail.thumbnails.slice(-1)[0].url
          });
        }

        if (videos.length >= 3) break;
      }
    }

    return videos;
  } catch (err) {
    console.error('YouTube scrape error:', err.message);
    return [];
  }
};

module.exports = { fetchYouTubeVideo };
