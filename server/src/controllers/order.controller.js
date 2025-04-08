import OrderService from "../services/order.service.js";
import httpStatus from "http-status";
import Message from "../utils/message.js";


// Create a new Order
export const createOrder = async (req, res) => {
    try {
        const newOrder = await OrderService.createOrder(req.body);
        res.status(httpStatus.CREATED).send({
            code: httpStatus.CREATED,
            message: Message.OrderCreated,
            data: newOrder,
          });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.BAD_REQUEST).send({
          code: httpStatus.BAD_REQUEST,
          message: Message.OrderCreatedFailed,
        });
    }
};

// Get all Orders
export const getOrders = async (req, res) => {
    try {
      const { page } = req.query;//lấy page từ query params
      const limit = parseInt(req.query.limit) || PaginationEnum.DEFAULT_LIMIT;
        const Orders = await OrderService.getOrders(page, limit);
        res.status(httpStatus.OK).send({
            code: httpStatus.OK,
            message: Message.OK,
            data: Orders,
          });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.BAD_REQUEST).send({
          code: httpStatus.BAD_REQUEST,
          message: Message.FAILED,
        });
    }
};

// Get a single Order by ID
export const getOrderById = async (req, res) => {
    try {
        const Order = await OrderService.getOrderById(req.params.id);
        res.status(httpStatus.OK).send({
            code: httpStatus.OK,
            message: Message.OK,
            data: Order,
          });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.BAD_REQUEST).send({
          code: httpStatus.BAD_REQUEST,
          message: Message.FAILED,
        });
    }
};

// Update an Order by ID
export const updateOrder = async (req, res) => {
    try {
        const updateOrder = await OrderService.updateOrder(req.params.id, req.body);
        res.status(httpStatus.OK).send({
            code: httpStatus.OK,
            message: Message.OrderUpdated,
            data: updateOrder,
          });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.BAD_REQUEST).send({
          code: httpStatus.BAD_REQUEST,
          message: Message.OrderUpdatedFailed,
        });
    }
};

// Delete an Order by ID
export const deleteOrder = async (req, res) => {
    try {
        const Orderdelete = await OrderService.deleteOrder(req.body);
        res.status(httpStatus.OK).send({
            code: httpStatus.OK,
            message: Message.OK,
            data: Orderdelete,
          });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.BAD_REQUEST).send({
          code: httpStatus.BAD_REQUEST,
          message: Message.FAILED,
        });
    }
};
