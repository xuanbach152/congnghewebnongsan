import { Schema, model } from "mongoose";

const cartSchema = Schema(
  {
    ownerId: {
      type: Schema.ObjectId,
      required: true,
      ref: "User",
    },
    cartItems: [
      { type: Schema.ObjectId, required: true, ref: "Item" },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Cart", cartSchema);
