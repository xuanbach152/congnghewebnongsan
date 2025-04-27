import ShopModel from "../models/shop.model.js";
import OrderModel from "../models/order.model.js";
import ItemModel from "../models/item.model.js";
import { throwBadRequest } from "../utils/error.util.js";
import Message from "../utils/message.js";

const createShop = async (shopData) => {
  const newShop = await ShopModel.create({
    ...shopData,
    imgUrl: shopData.imgUrl || "",
  });
  return newShop;
};
const searchShops = async (searchText) => {
  const regex = new RegExp(searchText, "i");
  return await ShopModel.find({
    $or: [{ name: { $regex: regex } }, { address: { $regex: regex } }],
  });
};

const updateShop = async (shopId, shopData) => {
  const Shop = await ShopModel.findById(shopId);
  throwBadRequest(!Shop, Message.ShopNotFound);
  return ShopModel.findByIdAndUpdate(
    shopId,
    { ...shopData, imgUrl: shopData.imgUrl || undefined },
    { new: true }
  );
};

const getShopById = async (ShopId) => {
  const Shop = await ShopModel.findById(ShopId);
  throwBadRequest(!Shop, Message.ShopNotFound);
  return Shop;
};

const getShops = async (
  page = 1,
  limit = 10,
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
const getShopsByUserId = async (
  userId,
  page = 1,
  limit = 10,
  sortField = "createdAt",
  sortType = "desc"
) => {
  const skip = (page - 1) * limit;
  const shops = await ShopModel.find({ userId })
    .sort({ [sortField]: sortType === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limit)
    .exec();
  return shops;
};
const getOrderStatistics = async (shopId, periodType, date) => {
  try {
    // Xác định khoảng thời gian
    const startDate = new Date(date);
    let endDate = new Date(date);

    if (periodType === "week") {
      endDate.setDate(endDate.getDate() + 7);
    } else if (periodType === "month") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      throw new Error("Invalid period type. Use 'week' or 'month'");
    }

    // Tìm tất cả đơn hàng
    const orders = await OrderModel.find({
      shopId: shopId,
      orderDate: { $gte: startDate, $lt: endDate },
      paymentStatus: "COMPLETED",
    }).populate([
      { path: "userId", select: "name email" },
      { path: "items.itemId", select: "name price imgUrl" },
    ]);

    let totalRevenue = 0;
    let totalOrders = orders.length;

    // Tính tổng doanh thu của shop từ các đơn hàng
    orders.forEach((order) => {
      totalRevenue += order.totalPrice || 0;
    });

    return {
      totalRevenue,
      totalOrders,
      periodType,
      startDate,
      endDate,
      orders,
    };
  } catch (error) {
    console.error(`Error in getOrderStatistics: ${error.message}`);
    throw error;
  }
};
const getItemStatistics = async (shopId, periodType, date) => {
  try {
    // Xác định khoảng thời gian
    const startDate = new Date(date);
    let endDate = new Date(date);

    if (periodType === "week") {
      endDate.setDate(endDate.getDate() + 7);
    } else if (periodType === "month") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      throw new Error("Invalid period type. Use 'week' or 'month'");
    }
    const orders = await OrderModel.find({
      shopId: shopId,
      orderDate: { $gte: startDate, $lt: endDate },
      paymentStatus: "COMPLETED",
    }).populate("items.itemId");

    const shopItems = await ItemModel.find({ shopId });

    // Tạo map để theo dõi thống kê cho mỗi sản phẩm
    const productStats = {};

    // Khởi tạo thống kê cho mỗi sản phẩm của shop
    shopItems.forEach((item) => {
      productStats[item._id.toString()] = {
        itemId: item._id,
        name: item.name,
        quantitySold: 0,
        quantityRemaining: item.quantity,
        revenue: 0,
      };
    });

    // Cập nhật thống kê từ các đơn hàng
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const itemId = item.itemId._id.toString();

        // Nếu sản phẩm thuộc shop
        if (productStats[itemId]) {
          productStats[itemId].quantitySold += item.quantity;
          productStats[itemId].revenue += item.price * item.quantity;
        }
      });
    });

    return {
      periodType,
      startDate,
      endDate,
      products: Object.values(productStats),
    };
  } catch (error) {
    console.error(`Error in getItemStatistics: ${error.message}`);
    throw error;
  }
};
export default {
  createShop,
  searchShops,
  updateShop,
  getShopById,
  getShops,
  deleteShop,
  saveImageToDatabase,
  getShopsByUserId,
  getOrderStatistics,
  getItemStatistics,
};
