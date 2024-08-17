import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Import your routes
import cron from 'node-cron';
import UserRoute from './route/UserRoute.js';
import PostRoute from './route/PostRoute.js';
import FollowRoute from './route/FollowRoute.js';
import StoryRoute from './route/StoryRoute.js'; // Assurez-vous que ce chemin est correct
import ActorRoute from './route/ActorRoute.js';

dotenv.config();

const app = express();
app.use(express.json());

// Middleware for parsing JSON bodies
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(`${process.env.BASE_URL}/follow`, FollowRoute);  // Add Follow routes
app.use(`${process.env.BASE_URL}/story`, StoryRoute);
app.use(`${process.env.BASE_URL}/users`, UserRoute);
app.use(`${process.env.BASE_URL}/actors`, ActorRoute);
app.use(`${process.env.BASE_URL}/posts`, PostRoute);  // Add Story routes

const prisma = new PrismaClient();

// Function to delete stories older than 3 minutes
const deleteOldStories = async () => {
    console.log('Attempting to delete old stories...');
    try {
        const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000); // 3 minutes ago

        const result = await prisma.story.deleteMany({
            where: {
                createdAt: {
                    lt: threeMinutesAgo
                }
            }
        });

        console.log(`Deleted ${result.count} old stories.`);
    } catch (error) {
        console.error('Error deleting old stories:', error);
    }
    console.log('Finished attempting to delete old stories.');
};

// Schedule the task to run every minute
cron.schedule('* * * * *', () => {
    console.log('Checking for old stories to delete...');
    deleteOldStories();
});


// Start the server
app.listen(Number(process.env.PORT), () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    console.log('Scheduled task for deleting old stories has started.');
});
