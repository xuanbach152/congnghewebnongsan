import OrderModel from "../models/order.model.js";
import { throwBadRequest } from "../utils/error.util.js";
import Message from "../utils/message.js";
import distanceService from "../utils/distance.utils.js";

const createOrder = async (userId, deliveryAddress, paymentMethod) => {
  try {
    const cart = await CartModel.findOne({ userId }).populate(
      "cartItems.itemId",
    );
    if (!cart || cart.cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    const shopAddress = cart.cartItems[0].itemId.address;

    const distanceInKm = await distanceService.calculateDistance(
      shopAddress,
      deliveryAddress,
    );

    const deliveryFee = distanceService.calculateDeliveryFee(distanceInKm);

    const totalPrice = cart.totalPrice;

    const totalPaymentAmount = totalPrice + deliveryFee;

    const newOrder = await OrderModel.create({
      userId,
      items: cart.cartItems.map((cartItem) => ({
        itemId: cartItem.itemId._id,
        quantity: cartItem.quantity,
      })),
      totalPrice,
      totalDeliveryFee: deliveryFee,
      totalPaymentAmount,
      deliveryAddress,
      paymentMethod,
      paymentStatus: "PENDING",
    });

    await CartModel.findOneAndDelete({ userId });

    return newOrder;
  } catch (error) {
    console.error("Error in createOrder:", error.message);
    throw error;
  }
};

const cancelOrder = async (orderId) => {
  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.paymentStatus !== "PENDING") {
      throw new Error("Order cannot be cancelled");
    }
    order.paymentStatus = "CANCELLED";
    await order.save();
    return order;
  } catch (error) {
    console.error("Error in cancelOrder:", error.message);
    throw error;
  }
};

const getOrderById = async (OrderId) => {
  const Order = await OrderModel.findById(OrderId);
  throwBadRequest(!Order, Message.OrderNotFound);
  return Order;
};

const getOrders = async (
  page,
  limit,
  sortField = "createdAt",
  sortType = "desc",
) => {
  try {
    const skip = (page - 1) * limit;
    const orders = await OrderModel.find()
      .skip(skip)
      .limit(Math.min(limit, 100))
      .sort({ [sortField]: sortType === "desc" ? -1 : 1 })
      .exec();

    const totalorders = await OrderModel.countDocuments();
    return {
      orders,
      totalorders,
      totalPages: Math.ceil(totalorders / limit),
      currentPage: parseInt(page),
    };
  } catch (error) {
    console.error("Error in getOrders:", error.message);
    throw error;
  }
};

const updateOrder = async (orderId, updateData) => {
  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    Object.keys(updateData).forEach((key) => {
      order[key] = updateData[key];
    });

    await order.save();

    return order;
  } catch (error) {
    console.error("Error in updateOrder:", error.message);
    throw error;
  }
};

const getOrdersByUser = async (userId) => {
  try {
    const orders = await OrderModel.find({ userId }).populate("items.itemId");
    return orders;
  } catch (error) {
    console.error("Error in getOrdersByUser:", error.message);
    throw error;
  }
};

const deleteOrder = async (OrderId) => {
  await OrderModel.findByIdAndDelete(OrderId);
};

export default {
  createOrder,
  cancelOrder,
  getOrderById,
  getOrders,
  deleteOrder,
  getOrdersByUser,
  updateOrder,
};
