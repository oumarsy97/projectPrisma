// import { Server as SocketIOServer } from 'socket.io';
// import http from 'http';

// const users = new Map<string, string>(); // Map pour stocker les utilisateurs connectés (socketId -> userId)

// export const configureSocketIO = (server: http.Server) => {
//   const io = new SocketIOServer(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on('connection', (socket) => {
//     console.log('Un utilisateur est connecté:', socket.id);

//     socket.on('user_connect', (userId: string) => {
//       users.set(socket.id, userId);
//       socket.join(userId);
//       console.log(`Utilisateur ${userId} est connecté avec le socket ID ${socket.id}`);
      
//       // Émettre la liste mise à jour des utilisateurs connectés
//       io.emit('user_list', Array.from(users.values()));
//     });

//     socket.on('send_message', ({ senderId, receiverId, message }, callback) => {
//       try {
//         console.log(`Message reçu de ${senderId} à ${receiverId}: ${message}`);

//         // Envoyer le message au destinataire
//         io.to(receiverId).emit('receive_message', { senderId, message });

//         // Confirmer l'envoi au sender
//         if (typeof callback === 'function') {
//           callback({ success: true, message: 'Message envoyé avec succès' });
//         }
//       } catch (error) {
//         console.error('Erreur lors de l\'envoi du message:', error);

//         if (typeof callback === 'function') {
//           callback({ success: false, message: 'Erreur lors de l\'envoi du message' });
//         }
//       }
//     });

//     socket.on('disconnect', () => {
//       const userId = users.get(socket.id);
//       if (userId) {
//         users.delete(socket.id);
//         console.log(`Utilisateur ${userId} s'est déconnecté`);
        
//         // Émettre la liste mise à jour des utilisateurs connectés
//         io.emit('user_list', Array.from(users.values()));
//       }
//     });
//   });

//   return io;
// };