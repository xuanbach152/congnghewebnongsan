import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import dotenv from 'dotenv';
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
export default app;
