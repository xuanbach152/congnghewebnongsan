import ShopModel from "../models/shop.model.js";
import OrderModel from "../models/order.model.js";
import ItemModel from "../models/item.model.js";
import { throwBadRequest } from "../utils/error.util.js";
import Message from "../utils/message.js";

const createShop = async (shopData) => {
  const newShop = await ShopModel.create({
    ...shopData,
    imgUrl: shopData.image.path || ""
  });
  return newShop;
};
const searchShops = async (searchText) => {
  const regex = new RegExp(searchText, "i");
  return await ShopModel.find({
    $or: [{ name: { $regex: regex } }, { address: { $regex: regex } }],
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

const getShops = async (
  page,
  limit,
  sortField = "createdAt",
  sortType = "desc"
) => {
  try {
    const skip = (page - 1) * limit;
    const shops = await ShopModel.find()
      .sort({ [sortField]: sortType === "asc" ? 1 : -1 })
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

const saveImageToDatabase = async (shopId, imgUrl) => {
  try {
    const shop = await ShopModel.findById(shopId);
    if (!shop) {
      throw new Error("Shop not found");
    }

    console.log("Saving image URL to database:", imgUrl);

    shop.imgUrl = imgUrl;
    await shop.save();

    return shop;
  } catch (error) {
    console.error("Error in saveImageToDatabase:", error.message);
    throw error;
  }
};

const getRevenueByMonth = async (shopId, month, year) => {
  try {
    // Tính ngày bắt đầu và ngày kết thúc của tháng
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Lấy tất cả các đơn hàng của shop trong khoảng thời gian
    const orders = await OrderModel.find({
      "items.itemId": { $in: await getItemIdsByShop(shopId) },
      createdAt: { $gte: startDate, $lte: endDate },
      paymentStatus: "COMPLETED",
    });

    // Tính tổng doanh thu
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    return {
      totalRevenue,
      totalOrders: orders.length,
      orders,
    };
  } catch (error) {
    console.error("Error in getRevenueByMonth:", error.message);
    throw error;
  }
};


const getShopsByUserId = async (userId, page,
  limit,
  sortField = "createdAt",
  sortType = "desc") => {
  const skip = (page - 1) * limit;
  const shops = await ShopModel.find({ userId })
    .sort({ [sortField]: sortType === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limit)
    .exec();
  return shops;
};
export default {
  createShop,
  searchShops,
  updateShop,
  getShopById,
  getShops,
  deleteShop,
  saveImageToDatabase,
 
  getRevenueByMonth,
  getShopsByUserId,
};
