import express from "express";
import {
  createCart,
  getAllCarts,
  getCartUser,
calculateCartDeliveryFee,
  addToCart,
  removeCartItem,
  updateCartItem,
  deleteCart,
  clearCart,
} from "../controllers/cart.controller.js";
import { verifyToken } from "../services/auth.service.js";
const router = express.Router();

router.post("/", verifyToken, createCart);
router.post("/add", verifyToken, addToCart);
router.post("/calculate", verifyToken, calculateCartDeliveryFee);
router.put("/update", verifyToken, updateCartItem);
router.delete("/remove", verifyToken, removeCartItem);
router.delete("/clear", verifyToken, clearCart);
router.get("/", verifyToken, getAllCarts);
router.get("/getcart", verifyToken, getCartUser);
router.delete("/delete", verifyToken, deleteCart);
export default router;
