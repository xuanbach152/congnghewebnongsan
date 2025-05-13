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
      required: true,
      default: "none",
    },
    email: {
      type: String,
      default: "none",
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
    }
  },
  {
    timestamps: true,
  }
);

export default model("User", userSchema);
