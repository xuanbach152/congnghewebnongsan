import CommentModel from "../models/comment.model.js";
import { throwBadRequest } from "../utils/error.util.js";
import Message from "../utils/message.js";

const createComment = async (CommentData) => {
  const newComment = await CommentModel.create(CommentData);
  return newComment;
};

const updateComment = async (CommentId, CommentData) => {
  const Comment = await CommentModel.findById(CommentId);
  throwBadRequest(!Comment, Message.CommentNotFound);
  return CommentModel.findByIdAndUpdate(CommentId, CommentData, { new: true });
};

const getCommentById = async (CommentId) => {
  const Comment = await CommentModel.findById(CommentId);
  throwBadRequest(!Comment, Message.CommentNotFound);
  return Comment;
};

const getComments = async (page, limit) => {
   try {
     const skip = (page - 1) * limit;
     const comments = await CommentModel.find()
       .skip(skip)
       .limit(Math.min(limit, 100))
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

const deleteComment = async (CommentId) => {
  await CommentModel.findByIdAndDelete(CommentId);
};

export default {
  createComment,
  updateComment,
  getCommentById,
  getComments,
  deleteComment,
};
