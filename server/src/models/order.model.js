import { Schema, model } from "mongoose";
import {
  DeliveryTypeEnum,
  PaymentMethodTypeEnum,
  PaymentStatusEnum,
} from "../utils/constant.js";

const orderSchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    required: true,
    ref: "User",
  },
      shopId: {
        type: Schema.ObjectId,
        required: true,
        ref: "Shop",
      },
      items: [
        {
          itemId: {
            type: Schema.ObjectId,
            required: true,
            ref: "Item",
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
          }
        },
      ],

  orderDate: {
    type: Date,
    default: Date.now,
  },
  totalDiscountAmount: {
    type: Number,
    default: 0
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  totalDeliveryFee: {
    type: Number,
    required: true,
  },
  totalPaymentAmount: {
    type: Number,
    required: true,
  },
  deliveryType: {
    type: String,
    enum: DeliveryTypeEnum,
    required: true,
    default: DeliveryTypeEnum[0],
  },
  paymentMethod: {
    type: String,
    enum: PaymentMethodTypeEnum,
    required: true,
    default: PaymentMethodTypeEnum[0],
  },
  paymentStatus: {
    type: String,
    enum: PaymentStatusEnum,
    required: true,
    default: PaymentStatusEnum[0],
  },
});

export default model("Order", orderSchema);
