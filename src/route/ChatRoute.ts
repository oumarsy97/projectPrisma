import  ChatController  from "../controller/ChatController";
import Middleware from "../Middleware/Middelware.js";
import express from "express";

const router = express.Router();

router.post('/create', Middleware.auth, ChatController.createChatAndSendMessage);
router.get('/:chatId', Middleware.auth, ChatController.getChatMessages);
router.post('/mark-seen', Middleware.auth, ChatController.markMessageAsSeen);
router.put('/update/:chatId/:messageId', Middleware.auth, ChatController.updateMessage);
router.delete('/delete/:chatId/:messageId', Middleware.auth, ChatController.deleteMessage);
export default router ;