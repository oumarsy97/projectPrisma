import  ChatController  from "../controller/ChatController.js";
import Middleware from "../Middleware/Middleware.js";
import express from "express";

const router = express.Router();

router.post('/:senderId/:receiverId', Middleware.auth, ChatController.createChatAndSendMessage);
router.get('/:senderId/:receiverId', ChatController.getChatById);
export default router; 