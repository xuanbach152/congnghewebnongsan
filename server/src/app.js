import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { setupSocket } from "./configs/socket.config.js";
import http from "http";

import userRoutes from "./routes/user.route.js";
import itemRoutes from "./routes/item.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";
import shopRoutes from "./routes/shop.route.js";
import commentRoutes from "./routes/comment.route.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import chatBoxRoutes from "./routes/chatBox.route.js";

import dotenv from "dotenv";
dotenv.config();
const app = express();

const server = http.createServer(app);
setupSocket(server);

// Middleware
app.use(json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:4000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

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
app.use("/message", messageRoutes);
app.use("/chatBox", chatBoxRoutes);
app.get("/", (req, res) => {
  res.send("Chào mừng đến với Website Nông Sản Việt Nam");
});
// Lắng nghe server
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

export default app;
