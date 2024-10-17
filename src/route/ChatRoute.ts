import  ChatController  from "../controller/ChatController.js";
import Middleware from "../Middleware/Middleware.js";
import express from "express";

const router = express.Router();

router.post('/create', Middleware.auth, ChatController.createChatAndSendMessage);
router.get('/:idActor/:userID', Middleware.auth, ChatController.getChatById);
export default router; 