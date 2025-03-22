import ShopModel from "../models/shop.model.js";
import { throwBadRequest } from "../utils/error.util.js";
import Message from "../utils/message.js";

const createShop = async (ShopData) => {
  const newShop = await ShopModel.create(ShopData);
  return newShop;
};

const updateShop = async (ShopId, ShopData) => {
  const Shop = await ShopModel.findById(ShopId);
  throwBadRequest(!Shop, Message.ShopNotFound);
  return ShopModel.findByIdAndUpdate(ShopId, ShopData, { new: true });
};

const getShopById = async (ShopId) => {
  const Shop = await ShopModel.findById(ShopId);
  throwBadRequest(!Shop, Message.ShopNotFound);
  return Shop;
};

const getShops = async () => {
  const Shops = await ShopModel.find();
  return Shops;
};

const deleteShop = async (ShopId) => {
  await ShopModel.findByIdAndDelete(ShopId);
};

export default {
  createShop,
  updateShop,
  getShopById,
  getShops,
  deleteShop,
};
