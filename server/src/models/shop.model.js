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
  },
  {
    timestamps: true,
  }
);

export default model("Shop", shopSchema);
