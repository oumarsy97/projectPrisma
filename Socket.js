import { Server as SocketIOServer } from 'socket.io';
const users = new Map();
export const configureSocketIO = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    // Gestion des connexions Socket.IO
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        socket.on('user_connect', (userId) => {
            users.set(socket.id, userId);
            socket.join(`user_${userId}`);
            console.log(`User ${userId} connected and joined room user_${userId}`);
        });
        socket.on('disconnect', () => {
            const userId = users.get(socket.id);
            users.delete(socket.id);
            console.log(`User ${userId} disconnected`);
        });
    });
    return io;
};
