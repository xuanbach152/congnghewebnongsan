import CommentService from "../services/comment.service.js";
import httpStatus from "http-status";
import Message from "../utils/message.js";
import { uploadToCloudinary } from "../utils/file.util.js";
import { PaginationEnum } from "../utils/constant.js";
import { use } from "react";

// Create a new comment
export const createComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, content } = req.body;
    const image = req.file;
    let imgUrl;
    if (image) {
      imgUrl = await uploadToCloudinary(image);
    }
    const newComment = await CommentService.createComment({
      userId,
      itemId,
      content,
      imgUrl: imgUrl,
    });
    res.status(httpStatus.CREATED).send({
      code: httpStatus.CREATED,
      message: Message.CommentCreated,
      data: newComment,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.CommentCreatedFailed,
    });
  }
};

// Get all Comments
export const getComments = async (req, res) => {
  try {
    const { page } = req.query;
    const sortField = req.query.sortField;
    const sortType = req.query.sortType;
    const limit = parseInt(req.query.limit) || PaginationEnum.DEFAULT_LIMIT;
    const Comments = await CommentService.getComments(
      page,
      limit,
      sortField,
      sortType
    );
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: Comments,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
};

// Get a single Comment by ID
export const getCommentById = async (req, res) => {
  try {
    const Comment = await CommentService.getCommentById(req.params.id);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: Comment,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
};

// Update an Comment by ID
export const updateComment = async (req, res) => {
  try {
    const image = req.file;
    let imgUrl;
    if (image) {
      imgUrl = await uploadToCloudinary(image);
    }
    const updateComment = await CommentService.updateComment(req.params.id, {
      ...req.body,
      imgUrl,
    });
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.CommentUpdated,
      data: updateComment,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.CommentUpdatedFailed,
    });
  }
};
export const getCommentsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page } = req.query;
    const sortField = req.query.sortField;
    const sortType = req.query.sortType;
    const limit = parseInt(req.query.limit) || PaginationEnum.DEFAULT_LIMIT;
    const Comments = await CommentService.getCommentsByUser(
      userId,
      page,
      limit,
      sortField,
      sortType
    );
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: Comments,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
};

export const getCommentsByItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { page } = req.query;
    const sortField = req.query.sortField;
    const sortType = req.query.sortType;
    const limit = parseInt(req.query.limit) || PaginationEnum.DEFAULT_LIMIT;
    const Comments = await CommentService.getCommentsByItem(
      itemId,
      page,
      limit,
      sortField,
      sortType
    );
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: Comments,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
};
// Delete an Comment by ID
export const deleteComment = async (req, res) => {
  try {
    const cmtId = req.params.id;
    const comment = await CommentService.deleteComment(cmtId);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "Xóa bình luận thành công",
      data: comment,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
};

export const searchComment = async (req, res) => {
  try {
    const query = req.query.q;
    const comments = await CommentService.searchComment(query);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: comments,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
}
