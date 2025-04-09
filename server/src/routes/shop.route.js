import express from "express";
import {
  createShop,
  searchShops,
  getShops,
  getShopById,
  updateShop,
  deleteShop,
  uploadImage,
  getRevenueByMonth,
} from "../controllers/shop.controller.js";
import {uploadImg} from "../utils/upload.middleware.js";
const router = express.Router();

router.post("/", createShop);
router.get("/", getShops);
router.get("/search", searchShops);
router.get("/revenue/:shopId", getRevenueByMonth);
router.get("/:id", getShopById);
router.post("/:id/upload-image", uploadImg.single("image"), uploadImage);
router.put("/:id", updateShop);
router.delete("/:id", deleteShop);

export default router;
