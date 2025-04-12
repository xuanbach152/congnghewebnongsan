import { Schema, model } from "mongoose";

const cartSchema = Schema(
  {
    userId: {
      type: Schema.ObjectId,
      required: true,
      ref: "User",
    },
    cartItems: [
      {
        itemId: {
          type: Schema.ObjectId,
          required: true,
          ref: "Item",
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Cart", cartSchema);
