import { Schema, model } from "mongoose";

const chatBoxSchema = Schema(
  {
    users: [
      {
        type: Schema.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    messages: [
      {
        type: Schema.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("ChatBox", chatBoxSchema);
