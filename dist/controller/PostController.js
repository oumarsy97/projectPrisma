"use strict";
// import { Request, Response } from 'express';
// import { PrismaClient, Chat, User } from '@prisma/client';
// const prisma = new PrismaClient();
// class ChatController {
//   static async createChatAndSendMessage(req: Request, res: Response) {
//     const { recipientId } = req.params;
//     const { text } = req.body;
//     const initiatorId = req.userId;
//     try {
//       // Vérifiez si les utilisateurs existent
//       const initiator = await prisma.user.findUnique({ where: { id: initiatorId } });
//       const recipient = await prisma.user.findUnique({ where: { id: Number(recipientId) } });
//       if (!initiator || !recipient) {
//         return res.status(404).json({ message: 'Utilisateur non trouvé', status: false });
//       }
//       // Trouvez une discussion existante entre l'initiateur et le destinataire
//       let chat = await prisma.chat.findFirst({
//         where: {
//           OR: [
//             { initiator: { id: initiatorId }, recipient: { id: Number(recipientId) } },
//             { initiator: { id: Number(recipientId) }, recipient: { id: initiatorId } },
//           ],
//         },
//       });
//       // Si aucune discussion n'existe, créez-en une nouvelle
//       if (!chat) {
//         chat = await prisma.chat.create({
//           data: {
//             initiator: { connect: { id: initiatorId } },
//             recipient: { connect: { id: Number(recipientId) } },
//             messages: { create: { sender: { connect: { id: initiatorId } }, text } },
//           },
//           include: { messages: true },
//         });
//       } else {
//         const newMessage = await prisma.message.create({
//           data: {
//             sender: { connect: { id: initiatorId } },
//             text,
//             chat: { connect: { id: chat.id } },
//           },
//         });
//         chat.messages.push(newMessage);
//         await chat.save();
//       }
//       return res.status(200).json({
//         message: 'Message envoyé avec succès',
//         data: { chat, message: chat.messages[chat.messages.length - 1] },
//         status: true,
//       });
//     } catch (error) {
//       return res.status(400).json({ message: (error as Error).message, data: null, status: false });
//     }
//   }
//   static async getChatMessages(req: Request<{ chatId: string }>, res: Response) {
//     const { chatId } = req.params;
//     try {
//       const chat = await prisma.chat.findUnique({
//         where: { id: Number(chatId) },
//         include: { messages: { include: { sender: { select: { firstname: true, lastname: true } } } } },
//       });
//       if (!chat) {
//         return res.status(404).json({ message: 'Discussion non trouvée', status: false });
//       }
//       return res.status(200).json({
//         message: 'Messages récupérés avec succès',
//         data: chat.messages,
//         status: true,
//       });
//     } catch (error) {
//       return res.status(400).json({ message: (error as Error).message, data: null, status: false });
//     }
//   }
//   static async markMessageAsSeen(req: Request<{}, {}, { chatId: string; messageId: string }>, res: Response) {
//     const { chatId, messageId } = req.body;
//     try {
//       const chat = await prisma.chat.findUnique({
//         where: { id: Number(chatId) },
//         include: { messages: { where: { id: Number(messageId) } } },
//       });
//       if (!chat || chat.messages.length === 0) {
//         return res.status(404).json({ message: 'Discussion ou message non trouvé', status: false });
//       }
//       const message = chat.messages[0];
//       message.seen = true;
//       await prisma.message.update({
//         where: { id: message.id },
//         data: { seen: true },
//       });
//       return res.status(200).json({ message: 'Message marqué comme lu', status: true });
//     } catch (error) {
//       return res.status(400).json({ message: (error as Error).message, data: null, status: false });
//     }
//   }
//   static async updateMessage(req: Request<{ chatId: string; messageId: string }, {}, { text: string }>, res: Response) {
//     const { chatId, messageId } = req.params;
//     const { text } = req.body;
//     const userId = req.userId;
//     try {
//       const chat = await prisma.chat.findUnique({
//         where: { id: Number(chatId) },
//         include: { messages: { where: { id: Number(messageId) } } },
//       });
//       if (!chat || chat.messages.length === 0) {
//         return res.status(404).json({ message: 'Discussion ou message non trouvé', status: false });
//       }
//       const updatedMessage = chat.messages[0];
//       // Vérifiez que l'utilisateur est l'expéditeur du message et que le message a été envoyé dans les 2 dernières heures
//       if (
//         updatedMessage.senderId !== userId ||
//         Date.now() - new Date(updatedMessage.createdAt).getTime() > 2 * 60 * 60 * 1000
//       ) {
//         return res.status(403).json({ message: 'Modification non autorisée', status: false });
//       }
//       await prisma.message.update({
//         where: { id: updatedMessage.id },
//         data: { text },
//       });
//       return res.status(200).json({
//         message: 'Message mis à jour avec succès',
//         data: updatedMessage,
//         status: true,
//       });
//     } catch (error) {
//       return res.status(400).json({ message: (error as Error).message, data: null, status: false });
//     }
//   }
//   static async deleteMessage(req: Request<{ chatId: string; messageId: string }>, res: Response) {
//     const { chatId, messageId } = req.params;
//     const userId = req.userId;
//     try {
//       const chat = await prisma.chat.findUnique({
//         where: { id: Number(chatId) },
//         include: { messages: { where: { id: Number(messageId) } } },
//       });
//       if (!chat || chat.messages.length === 0) {
//         return res.status(404).json({ message: 'Discussion ou message non trouvé', status: false });
//       }
//       const messageToDelete = chat.messages[0];
//       // Vérifiez que l'utilisateur est l'expéditeur du message et que le message a été envoyé dans les 2 dernières heures
//       if (
//         messageToDelete.senderId !== userId ||
//         Date.now() - new Date(messageToDelete.createdAt).getTime() > 2 * 60 * 60 * 1000
//       ) {
//         return res.status(403).json({ message: 'Suppression non autorisée', status: false });
//       }
//       await prisma.message.delete({
//         where: { id: messageToDelete.id },
//       });
//       return res.status(200).json({ message: 'Message supprimé avec succès', status: true });
//     } catch (error) {
//       return res.status(400).json({ message: (error as Error).message, data: null, status: false });
//     }
//   }
// }
// export default ChatController;
