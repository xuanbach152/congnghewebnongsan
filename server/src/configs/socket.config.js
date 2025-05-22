import { Server } from "socket.io";
import messageService from "../services/message.service.js";

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://congnghewebnongsan.vercel.app/",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {

    socket.on("join", async ({ chatBoxId }) => {
      await socket.join(chatBoxId);
    });

    socket.on("message", async ({ chatBoxId, userId, content }) => {
      try {
        const createMessageData = {
          chatBoxId,
          content,
        };
        const newMessage = await messageService.createMessage(
          createMessageData,
          userId
        );

        io.to(chatBoxId).emit("message", {
          userId: newMessage.userId,
          chatBoxId: newMessage.chatBoxId,
          content: newMessage.content,
          createdAt: newMessage.createdAt,
        });
      } catch (error) {
        console.error("Error creating message:", error.message);
        socket.emit("error", "Đã xảy ra lỗi khi gửi tin nhắn");
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};
