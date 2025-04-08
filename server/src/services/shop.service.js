import ShopModel from "../models/shop.model.js";
import { throwBadRequest } from "../utils/error.util.js";
import Message from "../utils/message.js";

const createShop = async (ShopData) => {
  const newShop = await ShopModel.create(ShopData);
  return newShop;
};
const searchShops = async (searchText) => {
  const regex = new RegExp(searchText, "i");
  return await ShopModel.find({
    $or: [
      { name:{$regex: regex}  },
      { address: {$regex: regex} }
    ],
  });


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

const getShops = async (page, limit) => {
   try {
     const skip = (page - 1) * limit;
     const shops = await ShopModel.find()
       .skip(skip)
       .limit(Math.min(limit, 100))
       .exec();
 
     const totalshops = await ShopModel.countDocuments();
     return {
       shops,
       totalshops,
       totalPages: Math.ceil(totalshops / limit),
       currentPage: parseInt(page),
     };
   } catch (error) {
     console.error("Error in getShops:", error.message);
     throw error;
   }
};

const deleteShop = async (ShopId) => {
  await ShopModel.findByIdAndDelete(ShopId);
};

export default {
  createShop,
  searchShops,
  updateShop,
  getShopById,
  getShops,
  deleteShop,
};
