import express from 'express';
import UserRoute from './route/UserRoute.js';
import PostRoute from './route/PostRoute.js';
import ActorRoute from './route/ActorRoute.js';
import RepostRoute from './route/RepostRoute.js';
import ProduitRoute from './route/ProduitRoute.js';
import dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import setupSwagger from './utils/swagger.js';
dotenv.config();
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Gestion des Produits',
            version: '1.0.0',
            description: 'Documentation de l\'API pour la gestion des produits et des commandes',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}/api/v1`,
            },
        ],
        security: [
            {
                bearerAuth: [] 
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes/*.ts', './swagger.yaml'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(`${process.env.BASE_URL}/users`, UserRoute);
app.use(`${process.env.BASE_URL}/posts`, PostRoute);
app.use(`${process.env.BASE_URL}/reposts`, RepostRoute);
app.use(`${process.env.BASE_URL}/actors`, ActorRoute);
app.use(`${process.env.BASE_URL}/produits`, ProduitRoute);
app.listen(`${process.env.PORT}`, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
