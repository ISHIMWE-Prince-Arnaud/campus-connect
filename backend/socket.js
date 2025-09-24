import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Chat from './models/Chat.js';

export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.clientOrigin, credentials: true }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Unauthorized'));
    try {
      const payload = jwt.verify(token, process.env.jwtSecret);
      socket.userId = String(payload.id);
      return next();
    } catch {
      return next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(socket.userId);

    socket.on('join:chat', async ({ chatId }) => {
      const chat = await Chat.findById(chatId);
      if (!chat) return;
      const isMember = chat.participants.map(String).includes(String(socket.userId));
      const notExpired = new Date(chat.expiresAt) > new Date();
      if (isMember && notExpired) {
        socket.join(String(chat._id));
      }
    });
  });

  return io;
}


