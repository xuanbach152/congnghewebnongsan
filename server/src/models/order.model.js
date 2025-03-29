import { Schema, model } from "mongoose";
import { DeliveryTypeEnum, PaymentMethodTypeEnum, PaymentStatusEnum } from "../utils/constant.js";

const orderSchema = new Schema({
  ownerId: {
    type: Schema.ObjectId,
    required: true,
    ref: "User",
  },
  items: [
    {
      type: Schema.ObjectId,
      required: true,
      ref: "Item",
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  totalDiscountAmount: {
    type: Number,
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
  },
  paymentMethod: {
    type: String,
    enum: PaymentMethodTypeEnum,
    required: true,
  },
  paymentStatus: {
    type: String, 
    enum: PaymentStatusEnum,
    required: true,
  },
});

export default model("Order", orderSchema);
