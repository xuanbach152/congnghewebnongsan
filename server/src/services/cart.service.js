import CartModel from "../models/cart.model.js";
import { throwBadRequest } from "../utils/error.util.js";
import Message from "../utils/message.js";

const createCart = async (CartData) => {
  const newCart = await CartModel.create(CartData);
  return newCart;
};

const updateCart = async (CartId, CartData) => {
  const Cart = await CartModel.findById(CartId);
  throwBadRequest(!Cart, Message.CartNotFound);
  return CartModel.findByIdAndUpdate(CartId, CartData, { new: true });
};

const getCartById = async (CartId) => {
  const Cart = await CartModel.findById(CartId);
  throwBadRequest(!Cart, Message.CartNotFound);
  return Cart;
};

const getCarts = async (page, limit) => {
  try {
    const skip = (page - 1) * limit;
    const carts = await CartModel.find()
      .skip(skip)
      .limit(Math.min(limit, 100))
      .exec();

    const totalcarts = await CartModel.countDocuments();
    return {
      carts,
      totalcarts,
      totalPages: Math.ceil(totalcarts / limit),
      currentPage: parseInt(page),
    };
  } catch (error) {
    console.error("Error in getCarts:", error.message);
    throw error;
  }
};

const deleteCart = async (CartId) => {
  await CartModel.findByIdAndDelete(CartId);
};

export default {
  createCart,
  updateCart,
  getCartById,
  getCarts,
  deleteCart,
};
