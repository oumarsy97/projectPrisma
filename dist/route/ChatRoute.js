import ChatController from "../controller/ChatController.js";
import Middleware from "../Middleware/Middleware.js";
import express from "express";
const router = express.Router();
router.post('/:receiverId', Middleware.auth, ChatController.createChatAndSendMessage);
router.get('/:senderId/:receiverId', Middleware.auth, ChatController.getChatById);
router.get('/mychats', Middleware.auth, ChatController.checkIfConversationExists);
export default router;
