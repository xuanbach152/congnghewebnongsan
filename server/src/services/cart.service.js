import CartModel from "../models/cart.model.js";
import ItemModel from "../models/item.model.js";
import { throwBadRequest } from "../utils/error.util.js";
import Message from "../utils/message.js";

const createCart = async (CartData) => {
  const newCart = await CartModel.create(CartData);
  return newCart;
};
const addToCart = async (userId, itemId, quantity) => {
  try {
    const item = await ItemModel.findById(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      cart = await CartModel.create({ userId, cartItems: [], totalPrice: 0 });
    }

    const existingItem = cart.cartItems.find(
      (cartItem) => cartItem.itemId.toString() === itemId
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
      0
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
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    const cartItem = cart.cartItems.find(
      (item) => item.itemId.toString() === itemId
    );

    if (!cartItem) {
      throw new Error("Item not found in cart");
    }

    cartItem.quantity = quantity;

    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error in updateCartItem:", error.message);
    throw error;
  }
};


const getCartById = async (CartId) => {
  const Cart = await CartModel.findById(CartId);
  throwBadRequest(!Cart, Message.CartNotFound);
  return Cart;
};

const getCart = async (userId) => {
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
    console.error("Error in getCart:", error.message);
    throw error;
  }
};
const removeCartItem = async (userId, itemId) => {
  try {
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.cartItems = cart.cartItems.filter(
      (item) => item.itemId.toString() !== itemId
    );

    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error in removeCartItem:", error.message);
    throw error;
  }
};
const deleteCart = async (CartId) => {
  await CartModel.findByIdAndDelete(CartId);
};

export default {
  createCart,
  updateCartItem,
  getCartById,
  getCart,
  addToCart,
  deleteCart,
  removeCartItem,
};
