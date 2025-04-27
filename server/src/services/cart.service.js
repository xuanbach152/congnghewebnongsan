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
    if (!item.quantity || item.quantity < quantity) {
      throw new Error(`Not enough items in stock. Only ${item.quantity || 0} items available.`);
    }
    let cart = await CartModel.findOne({ userId: userId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    let existingShopGroup = cart.shopGroup.find(
      (group) => group.shopId.toString() === item.shopId.toString(),
    );
    if (!existingShopGroup) {
      existingShopGroup = {
        shopId: item.shopId,
        cartItems: [],
        totalPriceShop: 0
      };
      cart.shopGroup.push(existingShopGroup);
    }

    const existingItem = existingShopGroup.cartItems.find(
      (cartItem) => cartItem.itemId.toString() === itemId,
    );

    if (existingItem) {
 
      if (item.quantity < existingItem.quantity + quantity) {
        throw new Error(`Not enough items. Only ${item.quantity} available.`);
      }
      existingItem.quantity += quantity;
    } else {
      existingShopGroup.cartItems.push({
        itemId: item._id,
        quantity,
        name: item.name,
        price: item.price,
      });
    }
   existingShopGroup.totalPriceShop = existingShopGroup.cartItems.reduce(
    (total, cartItem) => total + cartItem.price * cartItem.quantity,
    0
  );

  cart.totalPaymentAmount = cart.shopGroup.reduce(
    (total, group) => total + group.totalPriceShop ,
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

    const item = await ItemModel.findById(itemId);
    if (!item) {
      throw new Error("Item not found");
    }
    if (!item.quantity || item.quantity < quantity) {
      throw new Error(`Not enough items. Only ${item.quantity || 0} items available.`);
    }

    const cart = await CartModel.findOne({ userId: userId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    // Tìm vị trí shop group và item trong giỏ hàng
    let shopGroupIndex = -1;
    let itemIndex = -1;
    
    for (let i = 0; i < cart.shopGroup.length; i++) {
      const group = cart.shopGroup[i];
      const idx = group.cartItems.findIndex(
        cartItem => cartItem.itemId.toString() === itemId
      );
      
      if (idx !== -1) {
        shopGroupIndex = i;
        itemIndex = idx;
        break;
      }
    }
    
    if (shopGroupIndex === -1 || itemIndex === -1) {
      throw new Error("Item not found in cart");
    }

    cart.shopGroup[shopGroupIndex].cartItems[itemIndex].quantity = quantity;
    
  
    cart.shopGroup[shopGroupIndex].totalPriceShop = cart.shopGroup[shopGroupIndex].cartItems.reduce(
      (total, cartItem) => total + cartItem.price * cartItem.quantity,
      0
    );
    
   
    cart.totalPaymentAmount = cart.shopGroup.reduce(
      (total, group) => total + group.totalPriceShop,
      0
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
      path: "shopGroup.cartItems.itemId",
      select: "imgUrl"
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

    cart.shopGroup = [];
    cart.totalPaymentAmount = 0;

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
    let shopGroupIndex = -1;
    let itemIndex = -1;
    for (let i = 0; i < cart.shopGroup.length; i++) {
      const group = cart.shopGroup[i];
      const idx = group.cartItems.findIndex(
        cartItem => cartItem.itemId.toString() === itemId
      );
      
      if (idx !== -1) {
        shopGroupIndex = i;
        itemIndex = idx;
        break;
      }
    }
    if (shopGroupIndex === -1 || itemIndex === -1) {
      throw new Error("Item not found in cart");
    }

    cart.shopGroup[shopGroupIndex].cartItems.splice(itemIndex, 1);

    // Nếu shopGroup không còn cartItems nào, xóa luôn shopGroup
    if (cart.shopGroup[shopGroupIndex].cartItems.length === 0) {
      cart.shopGroup.splice(shopGroupIndex, 1);
    }

    cart.shopGroup[shopGroupIndex].totalPriceShop = cart.shopGroup[shopGroupIndex].cartItems.reduce(
      (total, cartItem) => total + cartItem.price * cartItem.quantity,
      0
    );

    cart.totalPaymentAmount = cart.shopGroup.reduce(
      (total, group) => total + group.totalPriceShop,
      0
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
