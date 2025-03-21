import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";


import userRoutes from "./routes/user.route.js";
import itemRoutes from "./routes/item.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";
import shopRoutes from "./routes/shop.route.js";
import commentRoutes from "./routes/comment.route.js";


import dotenv from "dotenv";
dotenv.config();
const app = express();

// Middleware
app.use(json());
app.use(cors());

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// Kết nối MongoDB
connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

app.use("/user", userRoutes);
app.use("/item", itemRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/shop", shopRoutes);
app.use("/comment", commentRoutes);

export default app;
