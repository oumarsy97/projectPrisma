// StoryRoute.ts
import express from 'express';
import StoryController from '../controller/StoryController.js';
import Middleware from '../Middleware/Middleware.js';
import upload from '../config/multerConfig.js';

const router = express.Router();

router.post('/create', Middleware.auth, upload, StoryController.create);
router.delete('/delete/:idStory', Middleware.auth, StoryController.deleteStory);
router.get('/storyfollowed', Middleware.auth, StoryController.getMyFollowingStories);
router.get('/mystories', Middleware.auth, StoryController.getMyStories);
router.post('/view/:idStory', Middleware.auth, StoryController.viewStory);
router.get('/views/:idStory', Middleware.auth, StoryController.getStoryViews);
  
export default router;
