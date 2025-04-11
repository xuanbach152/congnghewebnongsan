import UserModel from "../models/user.model.js";
import { throwBadRequest } from "../utils/error.util.js";
import Message from "../utils/message.js";
import { comparePassword } from "./auth.service.js";
const createUser = async (userData) => {
  const newUser = await UserModel.create(userData);
  return newUser;
};
const searchUsers = async (searchText) => {
  const regex = new RegExp(searchText, "i");
  return await UserModel.find({
    $or: [{ userName: { $regex: regex } }, { address: { $regex: regex } }],
  });
};

const updateUser = async (userId, userData) => {
  const user = await UserModel.findById(userId);
  throwBadRequest(!user, Message.userNotFound);
  return UserModel.findByIdAndUpdate(userId, userData, { new: true });
};

const getUserById = async (userId) => {
  const user = await UserModel.findById(userId);
  throwBadRequest(!user, Message.userNotFound);
  return user;
};

const getUsers = async (page, limit) => {
  try {
    const skip = (page - 1) * limit;
    const users = await UserModel.find()
      .skip(skip)
      .limit(Math.min(limit, 100))
      .exec();

    const totalusers = await UserModel.countDocuments();
    return {
      users,
      totalusers,
      totalPages: Math.ceil(totalusers / limit),
      currentPage: parseInt(page),
    };
  } catch (error) {
    console.error("Error in getUsers:", error.message);
    throw error;
  }
};

const deleteUser = async (userId) => {
  await UserModel.findByIdAndDelete(userId);
};
const getUserByName = async (userName) => {
  const user = await UserModel.findOne({ userName });
  throwBadRequest(!user, Message.userNotFound);
  return user;
};

export default {
  createUser,
  searchUsers,
  updateUser,
  getUserById,
  getUsers,
  deleteUser,
  getUserByName,
};
