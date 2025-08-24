const express = require('express');
const http = require('http'); 
const cors = require('cors');
require('dotenv').config();

const conn = require('./Configs/Connection');
const userRouter = require('./Routes/userRoutes');
const feedRouter = require('./Routes/feedRoutes');
const locationRouter = require('./Routes/locationRoutes');
const notificationRouter = require('./Routes/notificationRouter');
const fetchLocation = require('./Utils/fetchLocation');
const { fetchGoogleNews } = require('./Utils/fetchGoogleNews');
const { fetchYouTubeVideo } = require('./Utils/fetchYouTube');
const { initSocket } = require('./socket'); 
const app = express();
const server = http.createServer(app); 
const ravenCallRouter= require('./Routes/ravenCallRoutes');

conn.conn();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/user', userRouter);
app.use('/feed', feedRouter);
app.use('/location', locationRouter);
app.use('/notify', notificationRouter);

app.get('/', (req, res) => {
  res.send('Backend working');
});

// testiing route for fetchLocation 
app.get('/test', async (req, res) => {
  const data = await fetchLocation.fetchLocation(28.61, 77.2090);
  res.status(200).json({ data });
});

app.get('/news', async (req, res) => {
  const query = req.query.q || 'India';
  const news = await fetchGoogleNews(query);
  res.json({ query, news });
});

app.get('/youtube', async (req, res) => {
  const title = req.query.q || "India's latest news";
  const videos = await fetchYouTubeVideo(title);
  res.json(videos);
});


initSocket(server);

app.use('/ravenCall', ravenCallRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
