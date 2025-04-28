import express from "express";
import {
  createOrder,
  cancelOrder,
  getOrdersByUser,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  confirmOrder,
} from "../controllers/order.controller.js";
import { verifyToken } from "../services/auth.service.js";
const router = express.Router();

router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.get("/user", verifyToken, getOrdersByUser);
router.put("/confirm/:id", verifyToken, confirmOrder);
router.get("/:id",verifyToken, getOrderById);
router.put("/cancel/:id",verifyToken, cancelOrder);
router.put("/:id",verifyToken, updateOrder);
router.delete("/delete/:id",verifyToken, deleteOrder);



export default router;
