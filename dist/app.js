import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./docu.yaml');
import UserRoute from './route/UserRoute.js';
import PostRoute from './route/PostRoute.js';
import RepostRoute from './route/RepostRoute.js';
import ActorRoute from './route/ActorRoute.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use(`${process.env.BASE_URL}/users`, UserRoute);
app.use(`${process.env.BASE_URL}/actors`, ActorRoute);
app.use(`${process.env.BASE_URL}/posts`, PostRoute);
app.use(`${process.env.BASE_URL}/reposts`, RepostRoute);
app.listen(`${process.env.PORT}`, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    console.log(`day mboli rek http://localhost:${process.env.PORT}/api-docs`);
});
