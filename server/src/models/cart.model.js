import { Schema, model } from "mongoose";

const cartSchema = Schema(
  {
    userId: {
      type: Schema.ObjectId,
      required: true,
      ref: "User",
    },
    shopGroup: [
      {
        shopId: {
          type: Schema.ObjectId,
          required: true,
          ref: "Shop",
        },
        cartItems: [
          {
            itemId: {
              type: Schema.ObjectId,
              ref: "Item",
              required: true,
            },
            name: {
              type: String,
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
        totalPriceShop: {
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
