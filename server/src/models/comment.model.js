import { Schema, model } from "mongoose";

const commentSchema = Schema(
  {
    ownerId: {
      type: Schema.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Comment", commentSchema);
