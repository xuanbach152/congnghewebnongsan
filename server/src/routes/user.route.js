import express from "express";
import {
  createUser,
  searchUsers,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import { uploadImg } from "../utils/upload.middleware.js";
import { verifyToken, verifyRole } from "../services/auth.service.js";  
const router = express.Router();

router.post("/", uploadImg.single("image"), createUser);
router.get("/", verifyToken, getUsers);
router.get("/search", verifyToken, searchUsers);
router.patch("/", uploadImg.single("image"),verifyToken, updateUser);
router.get("/:id", verifyToken, getUserById);
router.delete("/", verifyToken, deleteUser);

export default router;
