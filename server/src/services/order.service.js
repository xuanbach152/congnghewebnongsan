import OrderModel from "../models/order.model.js";
import { throwBadRequest } from "../utils/error.util.js";
import Message from "../utils/message.js";

const createOrder = async (OrderData) => {
  const newOrder = await OrderModel.create(OrderData);
  return newOrder;
};

const updateOrder = async (OrderId, OrderData) => {
  const Order = await OrderModel.findById(OrderId);
  throwBadRequest(!Order, Message.OrderNotFound);
  return OrderModel.findByIdAndUpdate(OrderId, OrderData, { new: true });
};

const getOrderById = async (OrderId) => {
  const Order = await OrderModel.findById(OrderId);
  throwBadRequest(!Order, Message.OrderNotFound);
  return Order;
};

const getOrders = async () => {
  const Orders = await OrderModel.find();
  return Orders;
};

const deleteOrder = async (OrderId) => {
  await OrderModel.findByIdAndDelete(OrderId);
};

export default {
  createOrder,
  updateOrder,
  getOrderById,
  getOrders,
  deleteOrder,
};
