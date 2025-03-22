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
    },
    role: {
      type: String,
      enum: UserRoleEnum,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model('User', userSchema);