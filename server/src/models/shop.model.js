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
    },
    latitude: {
      type: Number,
    }
  },
  {
    timestamps: true,
  },
);

export default model("Shop", shopSchema);
