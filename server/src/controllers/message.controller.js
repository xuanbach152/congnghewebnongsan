import httpStatus from 'http-status';
import MessageService from '../services/message.service.js';
import Message from '../models/message.model.js';

export const createMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const message = await MessageService.createMessage(req.body, userId);
    res.status(httpStatus.CREATED).send({
      code: httpStatus.CREATED,
      message: 'Tạo tin nhắn thành công',
      data: message,
    });
  } catch (error) {
    console.error('Error in createMessage:', error.message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || 'Lỗi khi tạo tin nhắn',
    });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const message = await MessageService.updateMessage(req.params.id, req.body, userId);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: 'Cập nhật tin nhắn thành công',
      data: message,
    });
  } catch (error) {
    console.error('Error in updateMessage:', error.message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || 'Lỗi khi cập nhật tin nhắn',
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await MessageService.getMessages();
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: 'Lấy toàn bộ tin nhắn thành công',
      data: messages,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Không thể lấy tin nhắn',
    });
  }
};

export const getMessageById = async (req, res) => {
  try {
    const message = await MessageService.getMessageById(req.params.id);
    if (!message) {
      return res.status(httpStatus.NOT_FOUND).send({
        code: httpStatus.NOT_FOUND,
        message: 'Tin nhắn không tồn tại',
      });
    }
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: 'Lấy tin nhắn thành công',
      data: message,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || 'Không thể lấy tin nhắn',
    });
  }
};

export const getMessagesByChatBox = async (req, res) => {
  try {
    const { chatBoxId, skip = 0, limit = 20 } = req.query;
    const messages = await MessageService.getMessagesByChatBox(chatBoxId, parseInt(skip), parseInt(limit));
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: 'Lấy tin nhắn theo hộp thoại thành công',
      data: messages,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || 'Không thể lấy tin nhắn theo hộp thoại',
    });
  }
};

export const deleteMessageById = async (req, res) => {
  try {
    const deleted = await MessageService.deleteMessageById(req.params.id);
    if (!deleted) {
      return res.status(httpStatus.NOT_FOUND).send({
        code: httpStatus.NOT_FOUND,
        message: 'Tin nhắn không tồn tại',
      });
    }
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: 'Xóa tin nhắn thành công',
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || 'Không thể xóa tin nhắn',
    });
  }
};
