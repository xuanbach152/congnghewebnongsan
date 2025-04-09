import express from "express";
import {
  createCart,
  getCart,
  getCartById,
  addToCart,
  removeCartItem,
  updateCartItem,
  deleteCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/", createCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove", removeCartItem);
router.get("/:userId", getCart);
router.get("/getcart/:id", getCartById);
router.delete("/:id", deleteCart);
export default router;
