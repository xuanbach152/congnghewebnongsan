import { Schema, model } from "mongoose";
import { DeliveryTypeEnum, PaymentMethodTypeEnum, PaymentStatusEnum } from "../utils/constant.js";

const orderSchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    required: true,
    ref: "User",
  },
  items: [
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
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  totalDiscountAmount: {
    type: Number,
  },
  deliveryAddress: {
    type: String, 
    required: true,
  },
  totalDeliveryFee: {
    type: Number,
    required: true,
  },
  totalPaymentAmount: {
    type: Number,
    required: true,
    default: 0,
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
