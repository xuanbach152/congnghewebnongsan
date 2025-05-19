import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    senderId: {
        type: Schema.ObjectId,
        required: true,
        ref: "User",
    },
    content: {
        type: String,
        required: true,
    },
    chatBoxId: {
        type: Schema.ObjectId,
        required: true,
        ref: "ChatBox",
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});
export default model("Message", messageSchema);