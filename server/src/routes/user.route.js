import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/", createUser);
router.put("/:id", updateUser);
router.get("/:id", getUserById);
router.get("/", getUsers);
router.delete("/:id", deleteUser);

export default router;
