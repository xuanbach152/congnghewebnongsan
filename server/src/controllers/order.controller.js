import OrderService from "../services/order.service.js";
import httpStatus from "http-status";
import Message from "../utils/message.js";
import { PaginationEnum } from "../utils/constant.js";
// Create a new Order
export const createOrder = async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod } = req.body;
    const userId = req.user.id; 
    if (!userId || !deliveryAddress || !paymentMethod) {
      return res.status(400).send({
        code: 400,
        message: "Missing required fields",
      });
    }

    const order = await OrderService.createOrder(
      userId,
      deliveryAddress,
      paymentMethod
    );
    res.status(201).send({
      code: 201,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error in createOrder:", error.message);
    res.status(500).send({
      code: 500,
      message: error.message || "Failed to create order",
    });
  }
};
// cancel an Order
export const cancelOrder = async (req, res) => {
  try {
    const { id: orderId } = req.params;

    const cancelledOrder = await OrderService.cancelOrder(orderId);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "Order cancelled successfully",
      data: cancelledOrder,
    });
  } catch (error) {
    console.error("Error in cancelOrder:", error.message);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: error.message || "Failed to cancel order",
    });
  }
};

// Get all Orders
export const getOrders = async (req, res) => {
  try {
    const { page } = req.query; //lấy page từ query params
    const { sortField, sortType } = req.query;
    const limit = parseInt(req.query.limit) || PaginationEnum.DEFAULT_LIMIT;
    const Orders = await OrderService.getOrders(page, limit, sortField, sortType);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: Orders,
    });
  } catch (error) {
    console.log("Error in getOrders:", error.message);
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

export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.id; 
    const orders = await OrderService.getOrdersByUser(userId);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error in getOrdersByUser:", error.message);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: error.message || "Failed to get orders by user",
    });
  }
};

// Update an Order by ID
export const updateOrder = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const updateData = req.body;

    const updatedOrder = await OrderService.updateOrder(orderId, updateData);

    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error in updateOrder:", error.message);

    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: error.message || "Failed to update order",
    });
  }
};

// Delete an Order by ID
export const deleteOrder = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const Orderdelete = await OrderService.deleteOrder(orderId);
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
