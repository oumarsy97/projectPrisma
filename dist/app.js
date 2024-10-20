import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import http from 'http';
import cron from 'node-cron';
// Import des routes
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
// Créer l'application Express
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
app.use(`${process.env.BASE_URL}/actors`, ActorRoute);
app.use(`${process.env.BASE_URL}/story`, StoryRoute);
app.use(`${process.env.BASE_URL}/users`, UserRoute);
app.use(`${process.env.BASE_URL}/posts`, PostRoute);
app.use(`${process.env.BASE_URL}/chats`, ChatRoute);
app.use(`${process.env.BASE_URL}/produits`, ProduitRoute);
app.use(`${process.env.BASE_URL}/reposts`, RepostRoute);
app.use(`${process.env.BASE_URL}/ventes`, VenteRoute);
// Créer le serveur HTTP en utilisant l'application Express
const server = http.createServer(app);
// Configurer Socket.IO avec le serveur HTTP
// Planification des tâches cron (par exemple pour supprimer les vieilles stories)
cron.schedule('0 * * * *', async () => {
    console.log('Checking for old stories to delete...');
    // Ajoutez ici la fonction pour supprimer les stories
});
// Démarrer le serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
