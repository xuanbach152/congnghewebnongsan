import { Schema, model } from "mongoose";
import { UserRoleEnum } from "../utils/constant.js";

const userSchema = Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    imgUrl: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "none",
    },
    birthday: {
      type: Date,
      default: null,
    },
    bankAccount: {
      type: String,
      default: "",
    },
    bankName: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: UserRoleEnum,
      default: UserRoleEnum.BUYER,
      required: true,
    },
    longitude: {
      type: Number,
    },
    latitude: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "BANNED"],
      default: "ACTIVE",
    },
    reason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default model("User", userSchema);
