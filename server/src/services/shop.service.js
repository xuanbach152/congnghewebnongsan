import ShopModel from "../models/shop.model.js";
import OrderModel from "../models/order.model.js";
import ItemModel from "../models/item.model.js";
import { throwBadRequest } from "../utils/error.util.js";
import Message from "../utils/message.js";
import distanceService from "../utils/distance.utils.js";
const createShop = async (shopData) => {
  if (!shopData.name) {
    throwBadRequest(true, "Tên cửa hàng không được để trống");
  }

  if (!shopData.address) {
    throwBadRequest(true, "Địa chỉ cửa hàng không được để trống");
  }

  if (shopData.address && (!shopData.latitude || !shopData.longitude)) {
    try {
      const coordinates = await distanceService.geocodeAddress(
        shopData.address
      );
      shopData.latitude = coordinates.latitude;
      shopData.longitude = coordinates.longitude;
    } catch (error) {
      console.warn("Không thể lấy tọa độ từ địa chỉ:", error.message);
    }
  }
  const newShop = await ShopModel.create({
    ...shopData,
    imgUrl: shopData.imgUrl || "",
  });
  return newShop;
};

const searchShops = async (searchText) => {
  const regex = new RegExp(searchText, "i");
  // Tìm shop đã duyệt, tên khớp, và populate status user
  const shopsRaw = await ShopModel.find({
    status: "ACCEPTED",
    $or: [{ name: { $regex: regex } }],
  })
    .populate('userId', 'status')
    .lean();

  // Lọc shop có user không bị banned
  const shops = shopsRaw.filter(
    shop => !shop.userId || shop.userId.status !== "BANNED"
  );

  return shops;
};

const updateShop = async (shopId, shopData) => {
  const Shop = await ShopModel.findById(shopId);
  throwBadRequest(!Shop, Message.ShopNotFound);

  if (shopData.address && shopData.address !== Shop.address) {
    try {
      const coordinates = await distanceService.geocodeAddress(
        shopData.address
      );
      shopData.latitude = coordinates.latitude;
      shopData.longitude = coordinates.longitude;
    } catch (error) {
      console.warn("Không thể lấy tọa độ từ địa chỉ:", error.message);
    }
  }
  return ShopModel.findByIdAndUpdate(
    shopId,
    { ...shopData, imgUrl: shopData.imgUrl || undefined },
    { new: true }
  );
};

const getShopById = async (ShopId) => {
  const Shop = await ShopModel.findById(ShopId).populate("userId", "userName");
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
  const shops = await ShopModel.find({
    userId,
    status: { $ne: "DELETED" },
  })
    .sort({ [sortField]: sortType === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limit)
    .exec();
  const totalShopsByUser = await ShopModel.countDocuments({ userId });
  return {
    shops,
    totalShopsByUser,
    totalPages: Math.ceil(totalShopsByUser / limit),
    currentPage: parseInt(page),
  };
};

const getOrderStatistics = async (shopId, startDate = null, endDate = null) => {
  try {
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Đảm bảo endDate có giờ cuối cùng của ngày
    end.setHours(23, 59, 59, 999);

    // Tìm tất cả đơn hàng
    const orders = await OrderModel.find({
      shopId: shopId,
      orderDate: { $gte: start, $lte: end },
      paymentStatus: "COMPLETED",
    }).populate([
      { path: "userId", select: "userName email address" },
      { path: "items.itemId", select: "name price imgUrl" },
    ]);

    let totalRevenue = 0;
    let totalOrders = orders.length;

    orders.forEach((order) => {
      totalRevenue += order.totalPrice || 0;
    });

    return {
      totalRevenue,
      totalOrders,
      startDate: start,
      endDate: end,
      orders,
    };
  } catch (error) {
    console.error(`Error in getOrderStatistics: ${error.message}`);
    throw error;
  }
};

const getItemStatistics = async (shopId, startDate = null, endDate = null) => {
  try {
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Đảm bảo endDate có giờ cuối cùng của ngày
    end.setHours(23, 59, 59, 999);

    const orders = await OrderModel.find({
      shopId: shopId,
      orderDate: { $gte: start, $lte: end },
      paymentStatus: "COMPLETED",
    }).populate("items.itemId");

    const soldItemIds = new Set();

    // Thu thập ID của các sản phẩm đã bán từ đơn hàng
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.itemId && item.itemId._id) {
          soldItemIds.add(item.itemId._id.toString());
        }
      });
    });

    // Lấy thông tin chi tiết của các sản phẩm đã bán
    const soldItems = await ItemModel.find({
      shopId,
      _id: { $in: Array.from(soldItemIds) },
    });

    const productStats = {};

    soldItems.forEach((item) => {
      productStats[item._id.toString()] = {
        itemId: item._id,
        name: item.name,
        quantitySold: 0,
        quantityRemaining: item.quantity,
        imgUrl: item.imgUrl,
        price: item.price,
        type: item.type,
        revenue: 0,
      };
    });

    // Cập nhật thống kê từ các đơn hàng
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.itemId && item.itemId._id) {
          const itemId = item.itemId._id.toString();

          // Nếu sản phẩm thuộc shop
          if (productStats[itemId]) {
            productStats[itemId].quantitySold += item.quantity;
            productStats[itemId].revenue += item.price * item.quantity;
          }
        }
      });
    });

    return {
      startDate: start,
      endDate: end,
      products: Object.values(productStats),
    };
  } catch (error) {
    console.error(`Error in getItemStatistics: ${error.message}`);
    throw error;
  }
};

const getAllShopAccepted = async (page = 1, limit = 8) => {
  try {
    const skip = (page - 1) * limit;
    // Lấy shop đã duyệt và populate status user
    const [totalShops, shopsRaw] = await Promise.all([
      ShopModel.countDocuments({ status: "ACCEPTED" }),
      ShopModel.find({ status: "ACCEPTED" })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'status')
        .lean(),
    ]);

    // Lọc shop có user không bị banned
    const shops = shopsRaw.filter(
      shop => !shop.userId || shop.userId.status !== "BANNED"
    );

    return {
      shops,
      totalShops: shops.length,
      totalPages: Math.ceil(shops.length / limit),
      currentPage: parseInt(page),
    };
  } catch (error) {
    console.error(`Error in getAllShopAccepted: ${error.message}`);
    throw error;
  }
};

const censorshipCreateShop = async (shopId, status) => {
  try {
    const shop = await ShopModel.findOneAndUpdate(
      { _id: shopId, status: "PENDING" },
      { status },
      { new: true }
    );

    if (!shop) {
      throwBadRequest(
        true,
        "Shop không tồn tại hoặc không ở trạng thái chờ duyệt"
      );
    }

    return shop;
  } catch (error) {
    console.error(`Error in acceptCreateShop: ${error.message}`);
    throw error;
  }
};

const getAllShopPending = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const [totalShops, shops] = await Promise.all([
      ShopModel.countDocuments({ status: "PENDING" }),
      ShopModel.find({ status: "PENDING" }).skip(skip).limit(limit).lean(),
    ]);

    return {
      shops,
      totalShops,
      totalPages: Math.ceil(totalShops / limit),
      currentPage: parseInt(page),
    };
  } catch (error) {
    console.error(`Error in getAllShopPending: ${error.message}`);
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
  getAllShopAccepted,
  censorshipCreateShop,
  getAllShopPending,
};
