import UserModel from '../models/user.model.js';
import { throwBadRequest } from '../utils/error.util.js';
import Message from '../utils/message.js';

const createUser = async (userData) => {
    const newUser = await UserModel.create(userData);
    return newUser;
}

const updateUser = async (userId, userData) => {
    const user = await UserModel.findById(userId);
    throwBadRequest(!user, Message.userNotFound);
    return UserModel.findByIdAndUpdate(userId, userData, { new: true });
}

const getUserById = async (userId) => {
    const user = await UserModel.findById(userId);
    throwBadRequest(!user, Message.userNotFound);
    return user;
}

const getUsers = async () => {
    const users = await UserModel.find();
    return users;
}

const deleteUserById = async (userId) => {
    await UserModel.findByIdAndDelete(userId);
}
 
export default {
    createUser,
    updateUser,
    getUserById,
    getUsers,
    deleteUserById,
}