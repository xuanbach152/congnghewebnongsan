import express from "express";
import {
  createUser,
  searchUsers,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken,verifyRole } from "../services/auth.service.js";
const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/search", searchUsers);
router.put("/:id", updateUser);
router.get("/:id", getUserById);

router.delete("/:id", deleteUser);

export default router;
