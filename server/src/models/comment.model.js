import { Schema, model } from "mongoose";

const commentSchema = Schema(
  {
    userId: {
      type: Schema.ObjectId,
      required: true,
      ref: "User",
    },
    itemId: {
      type: Schema.ObjectId,
      required: true,
      ref: "Item",
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Comment", commentSchema);
