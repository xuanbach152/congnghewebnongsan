import ShopService from "../services/shop.service.js";
import httpStatus from "http-status";
import Message from "../utils/message.js";
import { PaginationEnum } from "../utils/constant.js";
import ItemService from "../services/item.service.js";
import { uploadToCloudinary } from "../utils/file.util.js";
// Create a new Shop
export const createShop = async (req, res) => {
  try {
    const { shopName: name, address } = req.body;
    const userId = req.user.id;
    const image = req.file;
    const imgUrl = await uploadToCloudinary(image);
    const newShop = await ShopService.createShop({ name, address, userId, image: { path: imgUrl } });
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
    const { page } = req.query; 
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
    const updatedShop = await ShopService.updateShop(req.params.id, req.body);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.ShopUpdated,
      data: updatedShop,
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

    const imgUrl = await uploadToCloudinary(req.file);
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

export const getShopsByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    const { page = 1, limit = 10, sortField = "createdAt", sortType = "desc" } = req.query;
    const shop = await ShopService.getShopsByUserId(userId, page, limit, sortField, sortType);
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
