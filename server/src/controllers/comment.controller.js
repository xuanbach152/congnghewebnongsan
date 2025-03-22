import CommentService from "../services/comment.service.js";
import httpStatus from "http-status";
import Message from "../utils/message.js";


// Create a new comment
export const createComment = async (req, res) => {
    try {
        const newComment = await CommentService.createComment(req.body);
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
        const Comments = await CommentService.getComments();
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
        const updateComment = await CommentService.updateComment(req.params.id, req.body);
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

// Delete an Comment by ID
export const deleteComment = async (req, res) => {
    try {
        const Commentdelete = await CommentService.deleteComment(req.body);
        res.status(httpStatus.OK).send({
            code: httpStatus.OK,
            message: Message.OK,
            data: Commentdelete,
          });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.BAD_REQUEST).send({
          code: httpStatus.BAD_REQUEST,
          message: Message.FAILED,
        });
    }
};
