import { Server } from "socket.io";
import Chat from '../models/chat.js'
const createSocket = async (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected to socket: " + socket.id);

    // User joins a chat room
    socket.on("joinChat", ({ userId, targetUserId, firstName }) => {
      const roomId = [userId, targetUserId].sort().join("-");
      console.log(`${firstName} joined room: ${roomId}`);
      socket.join(roomId);
    });

    // Sending a message
    socket.on("sendMessage", async({firstName,lastName, message, userId, targetUserId }) => {
      try{
      const roomId = [userId, targetUserId].sort().join("-");
      console.log(`Message from ${userId} to ${targetUserId}: ${message}`);
      //save user chat
      const chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } });
      if (!chat) {
        chat = new Chat({
          participants: [userId, targetUserId],
          messages: [],
        });
      }
      chat.messages.push({ firstName,lastName,senderId: userId, message, });
      await chat.save();

      // Make sure to send message only once
      io.to(roomId).emit("receiveMessage", { sender: userId, message });
      } catch (error) {
        console.log(error.message);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected successfully");
    });
  });
};

export default createSocket;
