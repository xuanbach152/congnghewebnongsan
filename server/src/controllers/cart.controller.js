import CartService from "../services/cart.service.js";
import httpStatus from "http-status";
import Message from "../utils/message.js";
import { PaginationEnum } from "../utils/constant.js";
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
// add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { itemId, quantity } = req.body;
    const cart = await CartService.addToCart(userId, itemId, quantity);
    res.status(200).send({
      code: 200,
      message: "Item added to cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error in addToCart:", error.message);
    res.status(500).send({
      code: 500,
      message: error.message || "Failed to add item to cart",
    });
  }
};

// Get all Carts
export const getAllCarts = async (req, res) => {
  try {
    const { page } = req.query; //lấy page từ query params
    const limit = parseInt(req.query.limit) || PaginationEnum.DEFAULT_LIMIT;
    const carts = await CartService.getAllCarts(page, limit);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: carts,
    });
  } catch (error) {
    console.error("Error in getAllCarts:", error.message);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
};


// Get all items in a user's cart
export const getCartUser = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).send({
        code: 400,
        message: "Missing required field: userId",
      });
    }

    const cart = await CartService.getCartUser(userId);
    res.status(200).send({
      code: 200,
      message: "Cart retrieved successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error in getCartUser:", error.message);
    res.status(500).send({
      code: 500,
      message: error.message || "Failed to retrieve cart",
    });
  }
};

// Update an item in the cart
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id; 
    const {  itemId, quantity } = req.body;

    if (!userId || !itemId || !quantity) {
      return res.status(400).send({
        code: 400,
        message: "Missing required fields: userId, itemId, quantity",
      });
    }

    const cart = await CartService.updateCartItem(userId, itemId, quantity);
    res.status(200).send({
      code: 200,
      message: "Cart item updated successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error in updateCartItem:", error.message);
    res.status(500).send({
      code: 500,
      message: error.message || "Failed to update cart item",
    });
  }
};
// Delete an Cart by ID
export const deleteCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const Cartdelete = await CartService.deleteCart(userId);
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
// Remove an item from the cart
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const {  itemId } = req.body;

    if (!userId || !itemId) {
      return res.status(400).send({
        code: 400,
        message: "Missing required fields: userId, itemId",
      });
    }

    const cart = await CartService.removeCartItem(userId, itemId);
    res.status(200).send({
      code: 200,
      message: "Cart item removed successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error in removeCartItem:", error.message);
    res.status(500).send({
      code: 500,
      message: error.message || "Failed to remove cart item",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).send({
        code: 400,
        message: "Missing required field: userId",
      });
    }
    const cart = await CartService.clearCart(userId);
    res.status(200).send({
      code: 200,
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error in clearCart:", error.message);
    res.status(500).send({
      code: 500,
      message: error.message || "Failed to clear cart",
    });
  }
};
export const calculateCartDeliveryFee = async (req, res) => {
  try{
    const userId = req.user.id;
    const { deliveryAddress } = req.body;
    if (!userId || !deliveryAddress) {
      return res.status(400).send({
        code: 400,
        message: "Missing required fields: userId, deliveryAddress",
      });
    }
    const cart = await CartService.calculateCartDeliveryFee(userId, deliveryAddress);
    res.status(200).send({
      code: 200,
      message: "Delivery fee calculated successfully",
      data: cart,
    });
  }
  catch(error){
    console.error("Error in calculateCartDeliveryFee:", error.message);
    res.status(500).send({
      code: 500,
      message: error.message || "Failed to calculate delivery fee",
    });
  }
};