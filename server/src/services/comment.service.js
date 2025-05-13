import CommentModel from "../models/comment.model.js";
import { throwBadRequest } from "../utils/error.util.js";
import Message from "../utils/message.js";

const createComment = async (CommentData) => {
  const newComment = await CommentModel.create(CommentData);
  return newComment;
};

const updateComment = async (CommentId, CommentData) => {
  const allowUpdate = ["content", "imgUrl"];
  const updateData = Object.keys(CommentData).reduce((acc, key) => {
    if (allowUpdate.includes(key)) acc[key] = CommentData[key];
    return acc;
  }, {});

  const Comment = await CommentModel.findById(CommentId);
  throwBadRequest(!Comment, Message.CommentNotFound);
  return CommentModel.findByIdAndUpdate(CommentId, updateData, { new: true });
};

const getCommentById = async (CommentId) => {
  const Comment = await CommentModel.findById(CommentId)
    .populate("userId", "username imgUrl")
    .populate("itemId", "name imgUrl");
  throwBadRequest(!Comment, Message.CommentNotFound);
  return Comment;
};

const getComments = async (
  page,
  limit,
  sortField = "createdAt",
  sortType = "asc"
) => {
  try {
    const skip = (page - 1) * limit;
    const comments = await CommentModel.find()
      .skip(skip)
      .limit(Math.min(limit, 100))
      .sort({ [sortField]: sortType === "asc" ? 1 : -1 })
      .populate("userId", "username imgUrl")
      .populate("itemId", "name imgUrl")
      .exec();

    const totalcomments = await CommentModel.countDocuments();
    return {
      comments,
      totalcomments,
      totalPages: Math.ceil(totalcomments / limit),
      currentPage: parseInt(page),
    };
  } catch (error) {
    console.error("Error in getComments:", error.message);
    throw error;
  }
};
const getCommentsByUser = async (
  userId,
  page,
  limit,
  sortField = "createdAt",
  sortType = "asc"
) => {
  try {
    const skip = (page - 1) * limit;
    const comments = await CommentModel.find({ userId })
      .skip(skip)
      .limit(Math.min(limit, 100))
      .sort({ [sortField]: sortType === "asc" ? 1 : -1 })
      .populate("itemId", "name imgUrl")
      .exec();
    const totalcomments = await CommentModel.countDocuments({ userId });
    return {
      comments,
      totalcomments,
      totalPages: Math.ceil(totalcomments / limit),
      currentPage: parseInt(page),
    };
  } catch (error) {
    console.error("Error in getCommentsByUser:", error.message);
    throw error;
  }
};
const getCommentsByItem = async (
  itemId,
  page,
  limit,
  sortField = "createdAt",
  sortType = "asc"
) => {
  try {
    const skip = (page - 1) * limit;
    const comments = await CommentModel.find({ itemId })
      .skip(skip)
      .limit(Math.min(limit, 100))
      .sort({ [sortField]: sortType === "asc" ? 1 : -1 })
      .populate("userId", "username imgUrl")
      .exec();
    const totalcomments = await CommentModel.countDocuments({ itemId });
    return {
      comments,
      totalcomments,
      totalPages: Math.ceil(totalcomments / limit),
      currentPage: parseInt(page),
    };
  } catch (error) {
    console.error("Error in getCommentsByItem:", error.message);
    throw error;
  }
};
const deleteComment = async (CommentId) => {
  await CommentModel.findByIdAndDelete(CommentId);
};
const searchComment = async (query) => {
  try {
    const regex = new RegExp(query, "i");
    const comments = await CommentModel.find({
      $or: [{ content: { $regex: regex } }],
    })
      .populate("userId", "username imgUrl")
      .populate("itemId", "name imgUrl");
    return comments;
  } catch (error) {
    console.error("Error in searchComment:", error.message);
    throw error;
  }
};
export default {
  createComment,
  updateComment,
  getCommentById,
  getComments,
  getCommentsByItem,
  getCommentsByUser,
  deleteComment,
  searchComment,
};
