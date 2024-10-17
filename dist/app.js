import express from 'express';
import cron from 'node-cron';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
// Importez vos routes
import UserRoute from './route/UserRoute.js';
import FollowRoute from './route/FollowRoute.js';
import StoryRoute from './route/StoryRoute.js';
import PostRoute from './route/PostRoute.js';
import ActorRoute from './route/ActorRoute.js';
import RepostRoute from './route/RepostRoute.js';
import VenteRoute from './route/VenteRoute.js';
import ChatRoute from './route/ChatRoute.js';
import ProduitRoute from './route/ProduitRoute.js';
dotenv.config();
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use(`${process.env.BASE_URL}/follows`, FollowRoute);
app.use(`${process.env.BASE_URL}/story`, StoryRoute);
app.use(`${process.env.BASE_URL}/users`, UserRoute);
app.use(`${process.env.BASE_URL}/actors`, ActorRoute);
app.use(`${process.env.BASE_URL}/posts`, PostRoute);
app.use(`${process.env.BASE_URL}/reposts`, RepostRoute);
app.use(`${process.env.BASE_URL}/ventes`, VenteRoute);
app.use(`${process.env.BASE_URL}/chat`, ChatRoute);
app.use(`${process.env.BASE_URL}/produits`, ProduitRoute);
// Fonction pour supprimer les histoires plus anciennes que 24 heures
const deleteOldStories = async () => {
    // ... (code inchangé)
};
// Planifiez la tâche pour s'exécuter toutes les heures
cron.schedule('0 * * * *', () => {
    console.log('Checking for old stories to delete...');
    deleteOldStories();
});
// Démarrez le serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
