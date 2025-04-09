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

const router = express.Router();

router.post("/", createOrder);

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/cancel/:id", cancelOrder);
router.put("/:id", updateOrder);
router.delete("/delete/:id", deleteOrder);
router.get("/user/:userId", getOrdersByUser);

export default router;
