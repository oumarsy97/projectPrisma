import express from 'express';
import UserRoute from './route/UserRoute.js';
import dotenv from 'dotenv';
dotenv.config();
 
const app = express();
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use(`${process.env.BASE_URL}/users`, UserRoute);
app.listen(`${process.env.PORT}`, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
}); 
