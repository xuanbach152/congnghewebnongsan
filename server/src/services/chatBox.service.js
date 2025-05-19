import ChatBoxModel from "../models/chatBox.model.js";

const createChatBox = async (userId, partnerId) => {
  if (userId === partnerId) {
    const error = new Error("Không thể tạo chatBox với bản thân");
    error.statusCode = 400;
    throw error;
  }

  const existing = await ChatBoxModel.findOne({
    users: { $all: [userId, partnerId], $size: 2 },
  }).populate([
    { path: "users", select: "userName" },
    { path: "messages" }
  ]);

  if (existing) return existing;

  const newChatBox = await ChatBoxModel.create({
    users: [userId, partnerId],
  });

  return await ChatBoxModel.findById(newChatBox._id).populate([
    { path: "users", select: "userName" },
    { path: "messages" }
  ]);
};


const getChatBoxesByUserId = async (userId) => {
  return await ChatBoxModel.find({ users: userId }).populate([
    { path: "users", select: "userName" },
    { path: "messages" }
  ]);
};


const getChatBoxById = async (id) => {
  const chatBox = await ChatBoxModel.findById(id).populate([
    { path: "users", select: "userName" },
    { path: "messages" }
  ]);

  if (!chatBox) {
    const error = new Error("Chatbox không tồn tại");
    error.statusCode = 404;
    throw error;
  }

  return chatBox;
};


const deleteChatBoxById = async (id) => {
  const chatBox = await ChatBoxModel.findById(id);
  if (!chatBox) {
    const error = new Error("Chatbox không tồn tại");
    error.statusCode = 404;
    throw error;
  }
  await ChatBoxModel.findByIdAndDelete(id);
  return true;
};

export default {
  createChatBox,
  getChatBoxesByUserId,
  getChatBoxById,
  deleteChatBoxById,
};
