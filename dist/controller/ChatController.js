import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// const app = expressLib();
// const server = http.createServer(app);
// const io = new SocketIOServer(server);
// app.use((req: Request, res: Response, next) => {
//   (req as any).io = io;
//   next();
// }); 
// const users = new Map();
const ChatController = {
    // Fonction pour créer un chat et envoyer un message
    createChatAndSendMessage: async (req, res) => {
        const { idUser, idActor } = req.params;
        const { message } = req.body;
        // const io = (req as any).io;
        try {
            // Vérifier si les utilisateurs existent
            const user = await prisma.user.findUnique({ where: { id: +idUser } });
            const actor = await prisma.actor.findUnique({ where: { id: +idActor } });
            if (!user || !actor) {
                return res.status(404).json({ message: "Utilisateur non trouvé", status: false });
            }
            const chat = await prisma.chat.create({
                data: {
                    user: { connect: { id: +idUser } },
                    actor: { connect: { id: +idActor } },
                    message: message, // Assurez-vous que ce champ est bien défini dans le schéma Prisma
                },
            });
            // Transmettre le message à l'utilisateur destinataire en temps réel
            // io.to(idUser).emit("message", req.body);
            // io.to(idActor).emit("message", req.body);
            return res.status(200).json({ message: "Message envoyé", status: true, data: chat });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Une erreur est survenue", status: false, data: null });
        }
    },
    //get chat by id user and id actor
    getChatById: async (req, res) => {
        const { userID, idActor } = req.params;
        try {
            const chat = await prisma.chat.findMany({
                where: {
                    OR: [
                        { idUser: +userID, idActor: +idActor },
                        { idUser: +idActor, idActor: +userID },
                    ],
                },
            });
            return res.status(200).json({ message: "Chats rechérchés", status: true, data: chat });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Une erreur est survenue", status: false, data: null });
        }
    },
};
export default ChatController;
// Créer et sauvegarder le message dans la base de données
// Transmettre le message à l'utilisateur destinataire en temps réel
