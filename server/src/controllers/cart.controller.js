import CartService from "../services/cart.service.js";
import httpStatus from "http-status";
import Message from "../utils/message.js";

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
    const { cartId, userId, itemId, quantity } = req.body;
    const cart = await CartService.addToCart(cartId, itemId, quantity);
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
export const getCarts = async (req, res) => {
  try {
    const { page } = req.query; //lấy page từ query params
    const limit = parseInt(req.query.limit) || PaginationEnum.DEFAULT_LIMIT;
    const Carts = await CartService.getCarts(page, limit);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: Carts,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
};

// Get a single Cart by ID
export const getCartById = async (req, res) => {
  try {
    const Cart = await CartService.getCartById(req.params.id);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: Cart,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
};
// Get all items in a user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).send({
        code: 400,
        message: "Missing required field: userId",
      });
    }

    const cart = await CartService.getCart(userId);
    res.status(200).send({
      code: 200,
      message: "Cart retrieved successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error in getCart:", error.message);
    res.status(500).send({
      code: 500,
      message: error.message || "Failed to retrieve cart",
    });
  }
};
// Update an Cart by ID
export const updateCartItem = async (req, res) => {
  try {
    const { cartId, itemId, quantity } = req.body;

    if (!cartId || !itemId || !quantity) {
      return res.status(400).send({
        code: 400,
        message: "Missing required fields: cartId, itemId, quantity",
      });
    }

    const cart = await CartService.updateCartItem(cartId, itemId, quantity);
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
    const Cartdelete = await CartService.deleteCart(req.body);
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
    const { cartId, itemId } = req.body;

    if (!cartId || !itemId) {
      return res.status(400).send({
        code: 400,
        message: "Missing required fields: cartId, itemId",
      });
    }

    const cart = await CartService.removeCartItem(cartId, itemId);
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
    const { cartId } = req.body;
    if (!cartId) {
      return res.status(400).send({
        code: 400,
        message: "Missing required field: cartId",
      });
    }
    const cart = await CartService.clearCart(cartId);
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
