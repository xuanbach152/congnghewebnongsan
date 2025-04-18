import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    senderId: {
        type: Schema.ObjectId,
        required: true,
        ref: "User",
    },
    receiverId: {
        type: Schema.ObjectId,
        required: true,
        ref: "User",
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});
export default model("Message", messageSchema);