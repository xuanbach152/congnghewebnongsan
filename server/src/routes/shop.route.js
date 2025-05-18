import express from "express";
import {
  createShop,
  searchShops,
  getShops,
  getShopById,
  updateShop,
  deleteShop,
  uploadImage,
  getShopsByUserId,
  getOrderStatistics, 
  getItemStatistics,
  getAllShopAccepted,
  censorshipCreateShop,
  getAllShopPending
} from "../controllers/shop.controller.js";
import { verifyToken } from "../services/auth.service.js";
import { uploadImg } from "../utils/upload.middleware.js";
const router = express.Router();

router.post("/", verifyToken, uploadImg.single("image"), createShop);
router.get("/", getShops);
router.get("/search", searchShops);
router.get("/user", verifyToken, getShopsByUserId);
router.get("/accepted", verifyToken, getAllShopAccepted);
router.get("/pending", verifyToken, getAllShopPending);
router.get("/:id", getShopById);
router.patch("/censorship/:shopId", verifyToken, censorshipCreateShop);
router.post("/:id/upload-image", uploadImg.single("image"), uploadImage);
router.patch("/:id", verifyToken, uploadImg.single("image"), updateShop);
router.delete("/:id", verifyToken, deleteShop);
router.get("/item-statistics/:shopId", verifyToken, getItemStatistics);
router.get("/order-statistics/:shopId", verifyToken, getOrderStatistics);
export default router;
