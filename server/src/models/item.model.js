import { Schema, model } from "mongoose";
import { ItemTypeEnum } from "../utils/constant.js";

const itemSchema = new Schema({
  shopId: {
    type: Schema.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
    default: "Tên sản phẩm mặc định",
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  type: {
    type: String,
    enum: ItemTypeEnum,
    required: true,
    default: ItemTypeEnum[0],
  },
  description: {
    type: String,
    required: true,
    default: "Mô tả mặc định",
  },
  imgUrl: {
    type: String,
    default: "",
  },
  videoUrl: {
    type: String,
    default: "",
  },
  rate: {
    type: Number,
    required: true,
    default: 5.0,
  },
  ratings: [
    {
      userId: {
        type: Schema.ObjectId,
        required: true,
        ref: "User",
      },
      rating: {
        type: Number,
        required: true,
        default: 0.0,
      },
    },
  ],
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  address: {
    type: String,
    required: true,
    default: "",
  },
  Comments: [
    {
      userId: {
        type: Schema.ObjectId,
        required: true,
        ref: "User",
      },
      content: {
        type: String,
        required: true,
      }
    },
  ],
});

export default model("Item", itemSchema);
