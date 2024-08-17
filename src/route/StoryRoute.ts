// StoryRoute.ts
import express from 'express';
import StoryController from '../controller/StoryController.js';
import Middleware from '../Middleware/Middelware.js';
import upload from '../config/multerConfig.js';

const router = express.Router();

router.delete('/delete/:idStory', Middleware.auth, Middleware.isTailor, StoryController.deleteStory);
router.get('/storyfollowed', Middleware.auth, StoryController.getMyFollowingStories);
router.get('/mystories', Middleware.auth, Middleware.isTailor, StoryController.getMyStories);
router.post('/create', Middleware.auth, Middleware.isTailor, upload, StoryController.create);
router.post('/view/:idStory', Middleware.auth, StoryController.viewStory);
router.get('/views/:idStory', Middleware.auth, StoryController.getStoryViews);

export default router;
