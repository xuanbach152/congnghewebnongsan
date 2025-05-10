import UserService from "../services/user.service.js";

import httpStatus from "http-status";
import Message from "../utils/message.js";
import { PaginationEnum } from "../utils/constant.js";
import { uploadToCloudinary } from "../utils/file.util.js";
export const createUser = async (req, res) => {
  try {
    const userData = { ...req.body };
    
  
    if (req.file) {
      const imgUrl = await uploadToCloudinary(req.file);
      userData.imgUrl = imgUrl;
    }

    const newUser = await UserService.createUser(userData);
    res.status(httpStatus.CREATED).send({
      code: httpStatus.CREATED,
      message: Message.userCreated,
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.userCreatedFailed,
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const searchText = req.query.searchText;
    const user = await UserService.searchUsers(searchText);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = { ...req.body };
    if (req.file) {
      const imgUrl = await uploadToCloudinary(req.file);
      userData.imgUrl = imgUrl;
    }
    const updatedUser = await UserService.updateUser(userId, userData);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.userUpdated,
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.userUpdatedFailed,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { page } = req.query; //lấy page từ query params
    const limit = parseInt(req.query.limit) || PaginationEnum.DEFAULT_LIMIT;
    const users = await UserService.getUsers(page, limit);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    await UserService.deleteUser(userId);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
};
