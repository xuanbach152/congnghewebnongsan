import ItemService from "../services/item.service.js";
import httpStatus from "http-status";
import Message from "../utils/message.js";
import { PaginationEnum } from "../utils/constant.js";
import e from "express";

// Create a new item
export const createItem = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { shopId, name, price, type, description, rate, quantity } = req.body;
    if (
      !shopId ||
      !name ||
      !price ||
      !type ||
      !description ||
      !rate ||
      !quantity
    ) {
      return res.status(httpStatus.BAD_REQUEST).send({
        code: httpStatus.BAD_REQUEST,
        message: "Thiếu dữ liệu bắt buộc",
      });
    }

    const newItem = await ItemService.createItem(req.body);
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
    const item = await ItemService.searchItems(searchText);
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
// Get all items
export const getItems = async (req, res) => {
  try {
    const { page } = req.query; //lấy page từ query params
    const limit = parseInt(req.query.limit) || PaginationEnum.DEFAULT_LIMIT;

    const items = await ItemService.getItems(page, limit);
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

export const getItemByShopId = async (req, res) => {
  try {
    const item = await ItemService.getItemByShopId(req.params.shopId);
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
    const updateitem = await ItemService.updateItem(req.params.id, req.body);
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
    const Itemdelete = await ItemService.deleteItem(req.body);
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
    const { userId, rating } = req.body;

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

    const imgUrl = await ItemService.uploadImageToCloudinary(req.file);
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

    const videoUrl = await ItemService.uploadVideoToCloudinary(req.file);
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
