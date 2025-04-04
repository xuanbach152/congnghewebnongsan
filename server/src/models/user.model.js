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
    role: {
      type: String,
      enum: UserRoleEnum,
      default: UserRoleEnum.BUYER,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("User", userSchema);
