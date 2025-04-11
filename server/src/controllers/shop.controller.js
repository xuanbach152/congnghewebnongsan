import ShopService from "../services/shop.service.js";
import httpStatus from "http-status";
import Message from "../utils/message.js";
import { PaginationEnum } from "../utils/constant.js";
import ItemService from "../services/item.service.js";
// Create a new Shop
export const createShop = async (req, res) => {
  try {
    const { name, address } = req.body;
    console.log(req.body);
    const userId = req.user.id;
    const newShop = await ShopService.createShop({ name, address, userId });
    res.status(httpStatus.CREATED).send({
      code: httpStatus.CREATED,
      message: Message.ShopCreated,
      data: newShop,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.ShopCreatedFailed,
    });
  }
};

// Search Shops by name, type, or description
export const searchShops = async (req, res) => {
  try {
    const searchText = req.query.searchText;
    const shop = await ShopService.searchShops(searchText);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: shop,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
};

// Get all Shops
export const getShops = async (req, res) => {
  try {
    const { page } = req.query; //lấy page từ query params
    const { sortField, sortType } = req.query;
    const limit = parseInt(req.query.limit) || PaginationEnum.DEFAULT_LIMIT;
    const Shops = await ShopService.getShops(page, limit, sortField, sortType);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: Shops,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
};

// Get a single Shop by ID
export const getShopById = async (req, res) => {
  try {
    const Shop = await ShopService.getShopById(req.params.id);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: Shop,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
};

// Update an Shop by ID
export const updateShop = async (req, res) => {
  try {
    const updateShop = await ShopService.updateShop(req.params.id, req.body);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.ShopUpdated,
      data: updateShop,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.ShopUpdatedFailed,
    });
  }
};

// Delete an Shop by ID
export const deleteShop = async (req, res) => {
  try {
    const Shopdelete = await ShopService.deleteShop(req.body);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: Shopdelete,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
};
//upload image
export const uploadImage = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("File received:", JSON.stringify(req.file, null, 2));

    const imgUrl = await ItemService.uploadImageToCloudinary(req.file);
    console.log("Image uploaded to Cloudinary:", imgUrl);

    const updatedItem = await ItemService.saveImageToDatabase(
      req.params.id,
      imgUrl,
    );
    console.log("Image URL saved to database:", updatedItem);

    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: updatedItem,
    });
  } catch (error) {
    console.error("Error during upload:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: Message.FAILED,
      error: error.message,
    });
  }
};

export const getRevenueByMonth = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { month, year } = req.query;

    if (!shopId || !month || !year) {
      return res.status(400).send({
        code: 400,
        message: "Missing required fields: shopId, month, or year",
      });
    }

    const revenueData = await ShopService.getRevenueByMonth(
      shopId,
      parseInt(month),
      parseInt(year),
    );

    res.status(200).send({
      code: 200,
      message: "Revenue data retrieved successfully",
      data: revenueData,
    });
  } catch (error) {
    console.error("Error in getRevenueByMonth:", error.message);
    res.status(500).send({
      code: 500,
      message: error.message || "Failed to retrieve revenue data",
    });
  }
};

export const getItemsByShopId = async (req, res) => {
  try {
    const shopid = req.params.id;
    const items = await ShopService.getItemsByShopId(shopid);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "Items retrieved successfully",
      data: items,
    });
  } catch (error) {
    console.error("Error in getItemByShopId:", error.message);
    res.status(500).send({
      code: 500,
      message: error.message || "Failed to retrieve items",
    });
  }
};

export const getShopsByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const shop = await ShopService.getShopsByUserId(userId);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: "Danh sách cửa hàng lấy thành công",
      data: shop,
    });
  } catch (error) {
    console.error("Error in getShopByUserId:", error.message);
    res.status(500).send({
      code: 500,
      message: error.message || "Failed to retrieve shop",
    });
  }
};
