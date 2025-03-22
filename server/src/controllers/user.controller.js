import userService from "../services/user.service.js";
import httpStatus from "http-status";
import Message from "../utils/message.js";

export const createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
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

export const updateUser = async (req, res) => {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body);
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
      const user = await userService.getUserById(req.params.id);
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
      const users = await userService.getUsers();
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
      await userService.deleteUser(req.params.id);
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

  

