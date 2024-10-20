import express from 'express';
import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors'; // Importez cors ici
import dotenv from 'dotenv';
// Import your routes
import UserRoute from './route/UserRoute.js';
import FollowRoute from './route/FollowRoute.js';
import StoryRoute from './route/StoryRoute.js';
import PostRoute from './route/PostRoute.js';
import ActorRoute from './route/ActorRoute.js';
import RepostRoute from './route/RepostRoute.js';
dotenv.config();
const app = express();
app.use(express.json());
// Middleware for parsing JSON bodies
// app.use(express.json()); 
// Configurez CORS
app.use(cors()); // Ajoutez ce middleware pour gérer CORS
// Déterminez le répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Chargez le fichier Swagger YAML
const swaggerDocument = YAML.load(path.join(__dirname, '..', 'src', 'config', 'swagger.yaml'));
// Middleware Swagger
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Route de base pour les tests
// Basic route for testing
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Montage des routes
app.use(`${process.env.BASE_URL}/follows`, FollowRoute);
app.use(`${process.env.BASE_URL}/story`, StoryRoute);
app.use(`${process.env.BASE_URL}/users`, UserRoute);
app.use(`${process.env.BASE_URL}/actors`, ActorRoute);
app.use(`${process.env.BASE_URL}/posts`, PostRoute);
const prisma = new PrismaClient();
// Fonction pour supprimer les histoires plus anciennes que 3 minutes
const deleteOldStories = async () => {
    console.log('Attempting to delete old stories...');
    try {
        const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 60 * 60 * 1000); // 3 minutes ago
        const result = await prisma.story.deleteMany({
            where: {
                createdAt: {
                    lt: threeMinutesAgo
                }
            }
        });
        console.log(`Deleted ${result.count} old stories.`);
    }
    catch (error) {
        console.error('Error deleting old stories:', error);
    }
    console.log('Finished attempting to delete old stories.');
};
// Planifiez la tâche pour s'exécuter toutes les minutes
cron.schedule('* * * * *', () => {
    console.log('Checking for old stories to delete...');
    deleteOldStories();
});
// Démarrez le serveur
app.use(`${process.env.BASE_URL}/reposts`, RepostRoute);
app.use(`${process.env.BASE_URL}/actors`, ActorRoute);
app.use(`${process.env.BASE_URL}/follow`, FollowRoute); // Add Follow routes
app.use(`${process.env.BASE_URL}/story`, StoryRoute); // Add Story routes
// Start the server
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
    console.log('Scheduled task for deleting old stories has started.');
});
