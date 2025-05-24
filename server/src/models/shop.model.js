import { Schema, model } from "mongoose";

const shopSchema = Schema(
  {
    userId: {
      type: Schema.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      default: "",
    },
    description: {
      type: String,
    },
    rate: {
      type: Number,
      default: 5,
    },
    longitude: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["REJECT", "PENDING", "DELETED", "ACCEPTED", "BANNED"],
      default: "PENDING",
    },
    reason: {
      type: String,
      default: "",
    }
  },
  {
    timestamps: true,
  },
);

export default model("Shop", shopSchema);
