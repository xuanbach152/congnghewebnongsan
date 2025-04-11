import express from "express";
import {
  createOrder,
  cancelOrder,
  getOrdersByUser,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/order.controller.js";
import { verifyToken } from "../services/auth.service.js";
const router = express.Router();

router.post("/", verifyToken, createOrder);

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/cancel/:id", cancelOrder);
router.put("/:id", updateOrder);
router.delete("/delete/:id", deleteOrder);
router.get("/user/:userId", verifyToken, getOrdersByUser);

export default router;
