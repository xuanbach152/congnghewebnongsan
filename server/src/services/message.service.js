import MessageModel from "../models/message.model.js";
import { throwBadRequest } from "../utils/error.util.js";
import Message from "../utils/message.js";

const getMessages = async (senderId, receiverId) => {
    const messages = await MessageModel.find({
        $or: [
            { senderId: senderId, receiverId: receiverId },
            { senderId: receiverId, receiverId: senderId },
        ],
    });
    return messages;
};

const saveMessage = async (senderId, receiverId, content) => {  
    const message = await MessageModel.create({
        senderId,
        receiverId,
        content,
    });
    return message;
};


export default { getMessages, saveMessage };