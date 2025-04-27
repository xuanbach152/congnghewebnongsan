import { Schema, model } from "mongoose";

const cartSchema = Schema(
  {
    userId: {
      type: Schema.ObjectId,
      required: true,
      ref: "User",
    },
    orderGroup: [
      {
        shopId: {
          type: Schema.ObjectId,
          required: true,
        },
        cartItems: [
          {
            itemId: {
              type: Schema.ObjectId,
              ref: "Item",
              required: true,
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
        totalDeliveryFee: {
          type: Number,
          required: true,
          default: 0,
        },
        totalPrice: {
          type: Number,
          required: true,
          default: 0,
        },
      }
    ],
    totalPaymentAmount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default model("Cart", cartSchema);
