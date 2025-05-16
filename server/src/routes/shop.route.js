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
  getAllShopPending,
  acceptCreateShop
} from "../controllers/shop.controller.js";
import { verifyToken } from "../services/auth.service.js";
import { uploadImg } from "../utils/upload.middleware.js";
const router = express.Router();

router.post("/", verifyToken, uploadImg.single("image"), createShop);
router.get("/", getShops);
router.get("/search", searchShops);
router.get("/user", verifyToken, getShopsByUserId);
router.get("/pending", verifyToken, getAllShopPending);
router.get("/:id", getShopById);
router.patch("/accept/:shopId", verifyToken, acceptCreateShop);
router.post("/:id/upload-image", uploadImg.single("image"), uploadImage);
router.patch("/:id", verifyToken, uploadImg.single("image"), updateShop);
router.delete("/:id", deleteShop);
router.get("/item-statistics/:shopId", verifyToken, getItemStatistics);
router.get("/order-statistics/:shopId", verifyToken, getOrderStatistics);
export default router;
