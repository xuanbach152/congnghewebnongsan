import chatBoxModel from "../models/chatBox.model.js";
import MessageModel from "../models/message.model.js";

const createMessage = async (messageData, userId) => {
  const newMessage = new MessageModel({
    ...messageData,
    senderId: userId,
  });

  const savedMessage = await newMessage.save();

  const { chatBoxId } = messageData;
  await chatBoxModel.findByIdAndUpdate(chatBoxId, {
    $push: { messages: savedMessage._id },
  });

  return savedMessage;
};


const updateMessage = async (id, messageData, userId) => {
  return await MessageModel.findByIdAndUpdate(
    id,
    {
      ...messageData,
      senderId: userId,
    },
    { new: true }
  );
};

const getMessages = async () => {
  return await MessageModel.find();
};

const getMessageById = async (id) => {
  const message = await MessageModel.findById(id);
  if (!message) {
    const error = new Error("Tin nhắn không tồn tại");
    error.statusCode = 404;
    throw error;
  }
  return message;
};

const getMessageByChatBox = async (chatBoxId, skip = 0, limit = 20) => {
  return await MessageModel.find({ chatBoxId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

const deleteMessageById = async (id) => {
  const message = await MessageModel.findById(id);
  if (!message) {
    const error = new Error("Tin nhắn không tồn tại");
    error.statusCode = 404;
    throw error;
  }
  await MessageModel.findByIdAndDelete(id);
};

export default {
  createMessage,
  updateMessage,
  getMessages,
  getMessageById,
  getMessageByChatBox,
  deleteMessageById,
};
