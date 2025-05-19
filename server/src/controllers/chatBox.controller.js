import httpStatus from "http-status";
import ChatBoxService from "../services/chatBox.service.js";
import Message from "../utils/message.js";
import mongoose from 'mongoose';

// Create ChatBox
export const createChatBox = async (req, res) => {
  try {
    const { partnerId } = req.body;
    const userId = req.user.id;

    const chatBox = await ChatBoxService.createChatBox(userId, partnerId);
    res.status(httpStatus.CREATED).send({
      code: httpStatus.CREATED,
      message: "Tạo chatBox thành công",
      data: chatBox,
    });
  } catch (error) {
    console.error("Error in createChatBox:", error.message);
    res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).send({
      code: error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || "Tạo chatBox thất bại",
    });
  }
};

// Get all ChatBoxes by userId
export const getChatBoxesByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const chatBoxes = await ChatBoxService.getChatBoxesByUserId(userId);

    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: chatBoxes,
    });
  } catch (error) {
    console.error("Error in getChatBoxesByUserId:", error.message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || Message.FAILED,
    });
  }
};

// Get ChatBox by ID
export const getChatBoxById = async (req, res) => {
  try {
    const { id } = req.params;
    const chatBox = await ChatBoxService.getChatBoxById(id);

    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: chatBox,
    });
  } catch (error) {
    console.error("Error in getChatBoxById:", error.message);
    res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).send({
      code: error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || Message.FAILED,
    });
  }
};

// Delete ChatBox by ID
export const deleteChatBoxById = async (req, res) => {
  try {
    const { id } = req.params;
    await ChatBoxService.deleteChatBoxById(id);

    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "Xóa chatBox thành công",
    });
  } catch (error) {
    console.error("Error in deleteChatBoxById:", error.message);
    res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).send({
      code: error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || "Xóa chatBox thất bại",
    });
  }
};
