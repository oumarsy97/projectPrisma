import express from 'express';
import dotenv from 'dotenv';

// Import your routes
import UserRoute from './route/UserRoute.js';
import FollowRoute from './route/FollowRoute.js';
import StoryRoute from './route/StoryRoute.js';

dotenv.config();

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Use the imported routes
app.use(`${process.env.BASE_URL}/users`, UserRoute);
app.use(`${process.env.BASE_URL}/follow`, FollowRoute);  // Add Follow routes
app.use(`${process.env.BASE_URL}/story`, StoryRoute);    // Add Story routes

// Start the server
app.listen(Number(process.env.PORT), () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

