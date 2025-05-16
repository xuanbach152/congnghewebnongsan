import UserModel from "../models/user.model.js";
import { throwBadRequest } from "../utils/error.util.js";
import Message from "../utils/message.js";
import { comparePassword, hashPassword } from "./auth.service.js";
import distanceService from "../utils/distance.utils.js";
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
  const allowedFields = [
    "userName",
    "password",
    "phone",
    "address",
    "email",
    "gender",
    "birthday",
    "bankAccount",
    "bankName",
    "imgUrl",
    "latitude",
    "longitude",
  ];
  const filteredData = {};
  Object.keys(userData).forEach((key) => {
    if (allowedFields.includes(key)) {
      filteredData[key] = userData[key];
    }
  });

  const user = await UserModel.findById(userId);
  throwBadRequest(!user, Message.userNotFound);
  if (filteredData.password) {
    const hashedPassword = await hashPassword(filteredData.password);
    filteredData.password = hashedPassword;
  }
  if (filteredData.address && filteredData.address !== user.address) {
    try {
      console.log(`Cập nhật tọa độ cho địa chỉ mới: ${filteredData.address}`);

      const coordinates = await distanceService.geocodeAddress(
        filteredData.address
      );

      filteredData.latitude = coordinates.latitude;
      filteredData.longitude = coordinates.longitude;

      console.log(
        `Tọa độ mới: ${coordinates.latitude}, ${coordinates.longitude}`
      );
    } catch (error) {
      console.warn(
        `Không thể lấy tọa độ từ địa chỉ ${filteredData.address}:`,
        error.message
      );
    }
  }
  return UserModel.findByIdAndUpdate(userId, filteredData, { new: true });
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

const saveImageToDatabase = async (userId, imgUrl) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    console.log("Saving image URL to database:", imgUrl);

    user.imgUrl = imgUrl;
    await user.save();

    return user;
  } catch (error) {
    console.error("Error in saveImageToDatabase:", error.message);
    throw error;
  }
};

export default {
  createUser,
  searchUsers,
  updateUser,
  getUserById,
  getUsers,
  deleteUser,
  getUserByName,
  saveImageToDatabase,
};
