import { Server } from "socket.io";
import http from "http";
import messageModel from "../models/message.model.js";

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Lắng nghe sự kiện join room
    socket.on("joinRoom", (userId) => {
      socket.join(userId); // Tham gia vào room với ID là userId
      console.log(`User ${userId} joined room`);
    });

    socket.on("sendMessage", async (message) => {
      console.log("Message received:", message);
      const { senderId, receiverId, content } = message;
      const newMessage = await messageModel.create({
        senderId,
        receiverId,
        content,
      });
      io.to(receiverId).emit("receiveMessage", newMessage);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  return io;
};
