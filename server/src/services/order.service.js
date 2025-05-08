import OrderModel from "../models/order.model.js";
import ItemModel from "../models/item.model.js";
import CartModel from "../models/cart.model.js";

import { throwBadRequest } from "../utils/error.util.js";
import Message from "../utils/message.js";
import distanceService from "../utils/distance.utils.js";

import CartService from "./cart.service.js";

import { PaginationEnum } from "../utils/constant.js";



const generateOrderCode = async () => {
  // Tạo mã đơn hàng theo định dạng: DH-YYYYMMDD-XXXX
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  const orderCode = `DH-${year}${month}${day}-${random}`;
  
  // Kiểm tra mã đã tồn tại chưa
  const existingOrder = await OrderModel.findOne({ orderCode });
  if (existingOrder) {
   
    return generateOrderCode();
  }
  
  return orderCode;
};

const createOrder = async (userId, deliveryAddress, paymentMethod, deliveryType) => {
  try {
    const cart = await CartModel.findOne({ userId }).populate(
      [
        { path: "shopGroup.cartItems.itemId", select: "imgUrl type price name quantity" },
        { path: "shopGroup.shopId", select: "address name" }
      ]
    );
    if (!cart || !cart.shopGroup || cart.shopGroup.length === 0) {
      throw new Error("Cart is empty");
    }

    const createdOrders = [];
  
    for(const shopGroup of cart.shopGroup) {
      const items = shopGroup.cartItems.map(cartItem => ({
        itemId: cartItem.itemId._id,
        name: cartItem.itemId.name, 
        price: cartItem.itemId.price, 
        quantity: cartItem.quantity,
      }));

      const shopAddress = shopGroup.shopId.address;

      const distanceInKm = await distanceService.calculateDistance(
        shopAddress,
        deliveryAddress,
      );

      const deliveryFee = distanceService.calculateDeliveryFee(distanceInKm);
      const orderCode = await generateOrderCode();
      const newOrder = await OrderModel.create({
        orderCode: orderCode,
        userId,
        shopId: shopGroup.shopId._id,
        items: items,
        orderDate: new Date(),
        totalPrice: shopGroup.totalPriceShop,
        totalDeliveryFee: deliveryFee,
        totalPaymentAmount: shopGroup.totalPriceShop + deliveryFee,
        totalDiscountAmount: 0,
        deliveryAddress,
        paymentMethod,
        deliveryType,
        paymentStatus: "PENDING",
      });

      createdOrders.push(newOrder);
     
    }

    await CartService.clearCart(userId);

    return createdOrders;
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

const getOrderById = async (orderId) => {
  try {
    const order = await OrderModel.findById(orderId).populate([
      { path: "shopId", select: "name address" },
      { path: "items.itemId", select: "name imgUrl price" }
    ]);
    
    throwBadRequest(!order, Message.OrderNotFound);
    return order;
  } catch (error) {
    console.error("Error in getOrderById:", error.message);
    throw error;
  }
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
      .populate([
        { path: "userId", select: "name email" },  
        { path: "shopId", select: "name address" },
        { path: "items.itemId", select: "name imgUrl price type quantity" } 
      ])
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

    // Chỉ cho phép cập nhật một số trường 
    const allowedFields = [
      'deliveryAddress', 
      'paymentMethod', 
      'deliveryType', 
      'paymentStatus',
      'totalDiscountAmount'
    ];

    // Chỉ cập nhật các trường được phép
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        order[field] = updateData[field];
      }
    });

    // Cập nhật lại totalPaymentAmount 
    if (updateData.totalDiscountAmount !== undefined) {
      order.totalPaymentAmount = order.totalPrice + order.totalDeliveryFee - order.totalDiscountAmount;
    }

    await order.save();
    return order;
  } catch (error) {
    console.error("Error in updateOrder:", error.message);
    throw error;
  }
};
const getOrdersByUser = async (userId, page,
  limit,
  sortField = "createdAt",
  sortType = "desc") => {
  try {
    const skip = (page - 1) * limit;
    const orders = await OrderModel.find({ userId })
      .skip(skip)
      .limit(Math.min(limit, 100))
      .sort({ [sortField]: sortType === "desc" ? -1 : 1 })
      .populate([
        { path: "shopId", select: "name address" },
        { path: "items.itemId", select: "name imgUrl price type quantity" }
      ]);
      const totalorders = await OrderModel.countDocuments({ userId });
      return {
        orders,
        totalorders,
        totalPages: Math.ceil(totalorders / limit),
        currentPage: parseInt(page),
      };
  } catch (error) {
    console.error("Error in getOrdersByUser:", error.message);
    throw error;
  }
};

const deleteOrder = async (OrderId) => {
  await OrderModel.findByIdAndDelete(OrderId);
};

const confirmOrder = async (orderId) => {
  try {
    const order = await OrderModel.findById(orderId).populate("items.itemId");
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.paymentStatus !== "PENDING") {
      throw new Error("Order cannot be confirmed. Only pending orders can be confirmed.");
    }
    const updatePromises = [];
    
     
      for (const item of order.items) {
        const itemInDb = item.itemId;
        
        if (!itemInDb) {
          throw new Error(`Item with ID ${item.itemId} not found`);
        }
        
       
        if (itemInDb.quantity < item.quantity) {
          throw new Error(`Not enough items in stock for ${itemInDb.name}. Available: ${itemInDb.quantity}, Required: ${item.quantity}`);
        }
        
      
        itemInDb.quantity -= item.quantity;
      
        itemInDb.purchaseCount += item.quantity;
        
        // Thêm vào mảng promises để cập nhật
        updatePromises.push(itemInDb.save());
      }
    
    
    // Cập nhật tất cả sản phẩm
    await Promise.all(updatePromises);
    
    order.paymentStatus = "COMPLETED";
    await order.save();
    return order;
  } catch (error) {
    console.error("Error in confirmOrder:", error.message);
    throw error;
  }
};


export default {
  createOrder,
  cancelOrder,
  getOrderById,
  getOrders,
  deleteOrder,
  getOrdersByUser,
  updateOrder,
  confirmOrder,
};
