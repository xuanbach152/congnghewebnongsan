import ItemService from "../services/item.service.js";
import httpStatus from "http-status";
import Message from "../utils/message.js";
import { PaginationEnum } from "../utils/constant.js";
import { uploadToCloudinary } from "../utils/file.util.js";
import e from "express";

// Create a new item
export const createItem = async (req, res) => {
  try {
    const { shopId, name, price, type, description, rate, quantity } = req.body;
    const image = req.file;
    const imgUrl = await uploadToCloudinary(image);
    if (!shopId || !name || !price || !type || !description || !quantity) {
      return res.status(httpStatus.BAD_REQUEST).send({
        code: httpStatus.BAD_REQUEST,
        message: "Thiếu dữ liệu bắt buộc",
      });
    }

    const newItem = await ItemService.createItem({
      shopId,
      name,
      price,
      type,
      description,
      rate,
      quantity,
      imgUrl,
    });
    res.status(httpStatus.CREATED).send({
      code: httpStatus.CREATED,
      message: Message.ItemCreated,
      data: newItem,
    });
  } catch (error) {
    console.error("Error in createItem:", error.message);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.ItemCreatedFailed,
      error: error.message,
    });
  }
};
// Search items by name, type, or description
export const searchItems = async (req, res) => {
  try {
    const searchText = req.query.searchText;
    const items = await ItemService.searchItems(searchText);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: items,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
};
// Get all items
export const getItems = async (req, res) => {
  try {
    const { page } = req.query; //lấy page từ query params
    const { sortField, sortType } = req.query;
    const limit = parseInt(req.query.limit) || PaginationEnum.DEFAULT_LIMIT;

    const items = await ItemService.getItems(page, limit, sortField, sortType);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: items,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
};

// Get a single item by ID
export const getItemById = async (req, res) => {
  try {
    const item = await ItemService.getItemById(req.params.id);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: item,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
};

// Update an item by ID
export const updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const itemData = req.body;
    const image = req.file;
    let imgUrl;
    if (image) {
      imgUrl = await uploadToCloudinary(image);
    }
    itemData.imgUrl = imgUrl;
    const updateitem = await ItemService.updateItem(itemId, itemData);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.ItemUpdated,
      data: updateitem,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.ItemUpdatedFailed,
    });
  }
};

// Delete an item by ID
export const deleteItem = async (req, res) => {
  try {
    const Itemdelete = await ItemService.deleteItem(req.params.id);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: Itemdelete,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
};
// Rate an item
export const rateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.user.id;
    const { rating } = req.body;

    const ratedItem = await ItemService.rateItem(itemId, userId, rating);
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: ratedItem,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
    });
  }
};

// Upload an image to Cloudinary
export const uploadImage = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("File received:", JSON.stringify(req.file, null, 2));

    const imgUrl = await uploadToCloudinary(req.file);
    console.log("Image uploaded to Cloudinary:", imgUrl);

    const updatedItem = await ItemService.saveImageToDatabase(
      req.params.id,
      imgUrl
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

// Upload a video to Cloudinary
export const uploadVideo = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("File received:", req.file);

    const videoUrl = await uploadToCloudinary(req.file);
    const updatedItem = await ItemService.saveVideoToDatabase(
      req.params.id,
      videoUrl
    );
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: updatedItem,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
      error: error.message,
    });
  }
};

export const getItemsByShopId = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sortField || "createdAt";
    const sortType = req.query.sortType === "asc" ? 1 : -1;

    const items = await ItemService.getItemsByShopId(
      shopId,
      page,
      limit,
      sortField,
      sortType
    );
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: items,
    });
  } catch (error) {
    console.error("Error in getItemsByShopId:", error.message);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
      error: error.message,
    });
  }
};
export const getRelatedItems = async (req, res) => {
  try {
    const itemId = req.params.id;
    const limit = parseInt(req.query.limit) || 4; // Mặc định lấy 4 sản phẩm liên quan

    const relatedItems = await ItemService.getRelatedItems(itemId, limit);

    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: relatedItems,
    });
  } catch (error) {
    console.error("Error in getRelatedItems:", error.message);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: Message.FAILED,
      error: error.message,
    });
  }
};

export const filterItems = async (req, res) => {
  try {
    const {
      type,
      minPrice,
      maxPrice,
      page = 1,
      limit = PaginationEnum.DEFAULT_LIMIT,
      sortField = "createdAt",
      sortType = "desc",
    } = req.query;

    const items = await ItemService.filterItems(
      { type, minPrice, maxPrice },
      page,
      limit,
      sortField,
      sortType
    );
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      message: Message.OK,
      data: items,
    });
  } catch (error) {
    console.error("Error in filterItems:", error.message);
    res.status(httpStatus.BAD_REQUEST).send({
      code: httpStatus.BAD_REQUEST,
      message: "Lọc sản phẩm không thành công",
      error: error.message,
    });
  }
};
