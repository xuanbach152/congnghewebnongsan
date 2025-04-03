import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.route.js";
import itemRoutes from "./routes/item.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";
import shopRoutes from "./routes/shop.route.js";
import commentRoutes from "./routes/comment.route.js";
import authRoutes from "./routes/auth.route.js";

import dotenv from "dotenv";
dotenv.config();
const app = express();

// Middleware
app.use(json());
app.use(cors());
app.use(cookieParser());

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// Kết nối MongoDB
connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB sucessfully !"))
  .catch((err) => {
console.error("MongoDB connection error:", err.message);
  });

app.use("/user", userRoutes);
app.use("/item", itemRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/shop", shopRoutes);
app.use("/comment", commentRoutes);
app.use("/auth", authRoutes);

export default app;
