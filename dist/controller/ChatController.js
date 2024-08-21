import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const ChatController = {
    createChatAndSendMessage: async (req, res) => {
        const { recipientId, text } = req.body;
        const initiatorId = parseInt(req.params.userId);
        try {
            // Vérifier si les utilisateurs existent
            const initiator = await prisma.user.findUnique({ where: { id: initiatorId } });
            const recipient = await prisma.actor.findUnique({ where: { id: parseInt(recipientId) } });
            if (!initiator || !recipient) {
                return res.status(404).json({ message: 'Utilisateur ou acteur non trouvé', status: false });
            }
            // Créer un nouveau message
            const newMessage = await prisma.message.create({
                data: {
                    sender: initiatorId,
                    content: [],
                    text,
                    chatId: undefined,
                    chat: {
                        connect: {
                            id: undefined, // Le chat sera connecté lors de la création/mise à jour
                        },
                    },
                },
            });
            // Trouver ou créer une discussion existante entre l'initiateur et le destinataire
            let chat = await prisma.chat.findFirst({
                where: {
                    OR: [
                        { idUser: initiatorId, idActor: parseInt(recipientId) },
                        { idUser: parseInt(recipientId), idActor: initiatorId },
                    ],
                },
            });
            if (!chat) {
                chat = await prisma.chat.create({
                    data: {
                        idUser: initiatorId,
                        idActor: parseInt(recipientId),
                        messages: {
                            connect: { id: newMessage.id },
                        },
                        content: [], // Mettre le contenu du chat ici
                    },
                });
            }
            else {
                await prisma.chat.update({
                    where: { id: chat.id },
                    data: {
                        messages: {
                            connect: { id: newMessage.id },
                        },
                    },
                });
            }
            return res.status(200).json({
                message: 'Message envoyé avec succès',
                data: { chat, message: newMessage },
                status: true,
            });
        }
        catch (error) {
            return res.status(400).json({ message: error.message, data: null, status: false });
        }
    },
    getChatMessages: async (req, res) => {
        const { chatId } = req.params;
        try {
            const chat = await prisma.chat.findUnique({
                where: { id: parseInt(chatId) },
                include: { messages: true },
            });
            if (!chat) {
                return res.status(404).json({ message: 'Discussion non trouvée', status: false });
            }
            return res.status(200).json({
                message: 'Messages récupérés avec succès',
                data: chat.messages,
                status: true,
            });
        }
        catch (error) {
            return res.status(400).json({ message: error.message, data: null, status: false });
        }
    },
    markMessageAsSeen: async (req, res) => {
        const { chatId, messageId } = req.body;
        try {
            const chat = await prisma.chat.findUnique({ where: { id: parseInt(chatId) } });
            if (!chat) {
                return res.status(404).json({ message: 'Discussion non trouvée', status: false });
            }
            const message = await prisma.message.update({
                where: { id: parseInt(messageId) },
                data: { seen: true },
            });
            if (!message) {
                return res.status(404).json({ message: 'Message non trouvé', status: false });
            }
            return res.status(200).json({ message: 'Message marqué comme lu', status: true });
        }
        catch (error) {
            return res.status(400).json({ message: error.message, data: null, status: false });
        }
    },
    updateMessage: async (req, res) => {
        const { chatId, messageId } = req.params;
        const { content, text } = req.body;
        const userId = parseInt(req.params.userId);
        try {
            const chat = await prisma.chat.findUnique({ where: { id: parseInt(chatId) } });
            if (!chat) {
                return res.status(404).json({ message: 'Discussion non trouvée', status: false });
            }
            const messageToUpdate = await prisma.message.findUnique({ where: { id: parseInt(messageId) } });
            if (!messageToUpdate) {
                return res.status(404).json({ message: 'Message non trouvé', status: false });
            }
            // Vérifier que l'utilisateur est l'expéditeur du message et que le message a été envoyé dans les 2 dernières heures
            if (messageToUpdate.sender.toString() !== userId.toString() ||
                Date.now() - messageToUpdate.createdAt.getTime() > 2 * 60 * 60 * 1000) {
                return res.status(403).json({ message: 'Modification non autorisée', status: false });
            }
            const updatedMessage = await prisma.message.update({
                where: { id: parseInt(messageId) },
                data: {
                    content,
                    text,
                },
            });
            return res.status(200).json({
                message: 'Message mis à jour avec succès',
                data: updatedMessage,
                status: true,
            });
        }
        catch (error) {
            return res.status(400).json({ message: error.message, data: null, status: false });
        }
    },
    deleteMessage: async (req, res) => {
        const { chatId, messageId } = req.params;
        const userId = req.params.userId;
        try {
            const chat = await prisma.chat.findUnique({ where: { id: parseInt(chatId) } });
            if (!chat) {
                return res.status(404).json({ message: 'Discussion non trouvée', status: false });
            }
            const messageToDelete = await prisma.message.findUnique({ where: { id: parseInt(messageId) } });
            if (!messageToDelete) {
                return res.status(404).json({ message: 'Message non trouvé', status: false });
            }
            // Vérifier que l'utilisateur est l'expéditeur du message et que le message a été envoyé dans les 2 dernières heures
            if (messageToDelete.sender.toString() !== userId ||
                Date.now() - messageToDelete.createdAt.getTime() > 2 * 60 * 60 * 1000) {
                return res.status(403).json({ message: 'Suppression non autorisée', status: false });
            }
            // Supprimer le message de la discussion
            await prisma.chat.update({
                where: { id: chat.id },
                data: {
                    messages: {
                        disconnect: { id: messageToDelete.id },
                    },
                },
            });
            // Supprimer le message de la base de données
            await prisma.message.delete({ where: { id: messageToDelete.id } });
            return res.status(200).json({ message: 'Message supprimé avec succès', status: true });
        }
        catch (error) {
            return res.status(400).json({ message: error.message, data: null, status: false });
        }
    },
};
export default ChatController;
