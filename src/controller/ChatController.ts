import expressLib, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ChatController = {
  // Fonction pour créer un chat et envoyer un message
  createChatAndSendMessage: async (req: Request, res: Response) => {
    
    const { message ,senderId,receiverId} = req.body;
   
    
    try {
      // Vérifier si les utilisateurs existent
      const sender = await prisma.user.findUnique({ where: { id: +senderId } });
  
      const receiver = await prisma.user.findUnique({ where: { id: +receiverId } });
      
      if (!sender || !receiver) {
        return res.status(404).json({ message: "Utilisateur non trouvé", status: false });
      }

      // Créer et sauvegarder le message dans la base de données
      const chat = await prisma.chat.create({
        data: {
          senderId: +senderId,
          receiverId: +receiverId,
          message: message,
        },
      });

      return res.status(200).json({ message: "Message envoyé", status: true, data: chat });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Une erreur est survenue", status: false, data: null });
    }
  },

  // Fonction pour récupérer les chats entre deux utilisateurs
  getChatById: async (req: Request, res: Response) => {
    const { senderId, receiverId } = req.params;
 
    try {
      const chat = await prisma.chat.findMany({
        where: { 
          OR: [
            { senderId: +senderId, receiverId: +receiverId },
            { senderId: +receiverId, receiverId: +senderId },
          ],
        },
        include: {
          sender: true,
          receiver: true
        },
        orderBy: {
          createdAt: 'asc', // Trier les messages par ordre chronologique
        },
      });

      return res.status(200).json({ message: "Chats recherchés", status: true, data: chat });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Une erreur est survenue", status: false, data: null });
    }
  },
 
  //verifier si l'utilisateur a une discussion avec un autre utilisateur
  checkIfConversationExists: async (req: Request, res: Response) => {
   const userId = req.params.userId;
 

    try {
      const conversation = await prisma.chat.findMany({
        where: {
          OR: [
            { receiverId: +userId },
            { senderId: +userId, },
          ],  
        },
        include: {
          sender: true,
          receiver: true
        },
        orderBy: {
          createdAt: 'asc', // Trier les messages par ordre chronologique
        },
      });
      return res.status(200).json({ message: "Conversation existante", status: true, data: conversation });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Une erreur est survenue", status: false, data: null });
    }
  },
};

export default ChatController;
