import CartModel from "../models/cart.model.js";
import ItemModel from "../models/item.model.js";
import { throwBadRequest } from "../utils/error.util.js";
import Message from "../utils/message.js";

const createCart = async (CartData) => {
  const newCart = await CartModel.create(CartData);
  return newCart;
};

const getAllCarts = async (page , limit ) => {
  const skip = (page - 1) * limit;
  const carts = await CartModel.find().skip(skip).limit(limit).exec();
  const totalCarts = await CartModel.countDocuments();
  const totalPages = Math.ceil(totalCarts / limit);
  return {
    carts,
    totalCarts,
    totalPages,
    currentPage: parseInt(page),
  };
};

const addToCart = async (userId, itemId, quantity) => {
  try {
    const item = await ItemModel.findById(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    let cart = await CartModel.findOne({ userId: userId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    const existingItem = cart.cartItems.find(
      (cartItem) => cartItem.itemId.toString() === itemId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.cartItems.push({
        itemId: item._id,
        quantity,
        price: item.price,
      });
    }

    cart.totalPrice = cart.cartItems.reduce(
      (total, cartItem) => total + cartItem.price * cartItem.quantity,
      0,
    );

    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error in addToCart:", error.message);
    throw error;
  }
};
const updateCartItem = async (userId, itemId, quantity) => {
  try {
    const cart = await CartModel.findOne({ userId: userId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    const cartItem = cart.cartItems.find(
      (item) => item.itemId.toString() === itemId,
    );

    if (!cartItem) {
      throw new Error("Item not found in cart");
    }

    cartItem.quantity = quantity;

    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error in updateCartItem:", error.message);
    throw error;
  }
};


const getCartUser = async (userId) => {
  try {
    const cart = await CartModel.findOne({ userId }).populate({
      path: "cartItems.itemId",
      select: "name imgUrl price",
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    return cart;
  } catch (error) {
    console.error("Error in getCartUser:", error.message);
    throw error;
  }
};
const clearCart = async (userId) => {
  try {
    const cart = await CartModel.findOne({ userId: userId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.cartItems = [];
    cart.totalPrice = 0;

    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error in clearCart:", error.message);
    throw error;
  }
};
const removeCartItem = async (userId, itemId) => {
  try {
    const cart = await CartModel.findOne({ userId: userId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.cartItems = cart.cartItems.filter(
      (item) => item.itemId.toString() !== itemId,
    );

    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error in removeCartItem:", error.message);
    throw error;
  }
};
const deleteCart = async (userId) => {
  const cart = await CartModel.findOne({ userId: userId });
  if (!cart) {
    throw new Error("Cart not found");
  }
  return CartModel.findByIdAndDelete(cart._id);
};

export default {
  createCart,
  updateCartItem,
  getAllCarts,
 
  getCartUser,
  addToCart,
  deleteCart,
  removeCartItem,
  clearCart,
};
