import express from "express";
import {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  getCommentsByUser,
  getCommentsByItem,
  deleteComment,
  searchComment,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../services/auth.service.js";
import { uploadImg } from "../utils/upload.middleware.js";

const router = express.Router();

router.post("/", verifyToken, uploadImg.single("image"), createComment);
router.get("/", verifyToken, getComments);
router.get("/user", verifyToken, getCommentsByUser);
router.get("/item/:itemId", getCommentsByItem);
router.get("/search", verifyToken, searchComment);
router.get("/:id", verifyToken, getCommentById);
router.put("/:id", verifyToken, uploadImg.single("image"), updateComment);
router.delete("/:id", verifyToken, deleteComment);


export default router;