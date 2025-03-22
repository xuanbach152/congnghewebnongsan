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

const getCarts = async () => {
  const Carts = await CartModel.find();
  return Carts;
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
