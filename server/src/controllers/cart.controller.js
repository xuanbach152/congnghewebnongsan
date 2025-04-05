import CartService from "../services/cart.service.js";
import httpStatus from "http-status";
import Message from "../utils/message.js";


// Create a new cart
export const createCart = async (req, res) => {
    try {
        const newCart = await CartService.createCart(req.body);
        res.status(httpStatus.CREATED).send({
            code: httpStatus.CREATED,
            message: Message.CartCreated,
            data: newCart,
          });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.BAD_REQUEST).send({
          code: httpStatus.BAD_REQUEST,
          message: Message.CartCreatedFailed,
        });
    }
};

// Get all Carts
export const getCarts = async (req, res) => {
    try {
      const { page } = req.query;//lấy page từ query params
      const limit = parseInt(req.query.limit) || PaginationEnum.DEFAULT_LIMIT;
        const Carts = await CartService.getCarts(page, limit);
        res.status(httpStatus.OK).send({
            code: httpStatus.OK,
            message: Message.OK,
            data: Carts,
          });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.BAD_REQUEST).send({
          code: httpStatus.BAD_REQUEST,
          message: Message.FAILED,
        });
    }
};

// Get a single Cart by ID
export const getCartById = async (req, res) => {
    try {
        const Cart = await CartService.getCartById(req.params.id);
        res.status(httpStatus.OK).send({
            code: httpStatus.OK,
            message: Message.OK,
            data: Cart,
          });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.BAD_REQUEST).send({
          code: httpStatus.BAD_REQUEST,
          message: Message.FAILED,
        });
    }
};

// Update an Cart by ID
export const updateCart = async (req, res) => {
    try {
        const updateCart = await CartService.updateCart(req.params.id, req.body);
        res.status(httpStatus.OK).send({
            code: httpStatus.OK,
            message: Message.CartUpdated,
            data: updateCart,
          });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.BAD_REQUEST).send({
          code: httpStatus.BAD_REQUEST,
          message: Message.CartUpdatedFailed,
        });
    }
};

// Delete an Cart by ID
export const deleteCart = async (req, res) => {
    try {
        const Cartdelete = await CartService.deleteCart(req.body);
        res.status(httpStatus.OK).send({
            code: httpStatus.OK,
            message: Message.OK,
            data: Cartdelete,
          });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.BAD_REQUEST).send({
          code: httpStatus.BAD_REQUEST,
          message: Message.FAILED,
        });
    }
};
