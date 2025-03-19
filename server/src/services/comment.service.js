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

const getComments = async () => {
  const Comments = await CommentModel.find();
  return Comments;
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
