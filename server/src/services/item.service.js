import ItemModel from "../models/item.model.js";
import ShopModel from "../models/shop.model.js";
import { throwBadRequest } from "../utils/error.util.js";
import { validateFile } from "../utils/file.util.js";
import Message from "../utils/message.js";
import cloudinary from "../configs/cloudinary.config.js";

const createItem = async (itemData) => {
  try {
    const shop = await ShopModel.findById(itemData.shopId);
    if (!shop) {
      throw new Error("Shop not found");
    }
    
    const newItem = await ItemModel.create(itemData);
    return newItem;
  } catch (error) {
    console.error("Error in createItem:", error.message);
    throw error;
  }
};

const searchItems = async (searchText) => {
  const regex = new RegExp(searchText, "i");
  return await ItemModel.find({
    $or: [
      { name: { $regex: regex } },
      { type: { $regex: regex } },
      { description: { $regex: regex } },
    ],
  });
};

const updateItem = async (itemId, itemData) => {
  try {
    const item = await ItemModel.findById(itemId);
    throwBadRequest(!item, Message.ItemNotFound);
    return ItemModel.findByIdAndUpdate(itemId, itemData, { new: true });
  } catch (error) {
    console.error("Error in updateItem:", error.message);
    throw error;
  }
};

const getItemById = async (itemId) => {
  try {
    const item = await ItemModel.findById(itemId);
    throwBadRequest(!item, Message.ItemNotFound);
    return item;
  } catch (error) {
    console.error("Error in getItemById:", error.message);
    throw error;
  }
};

const getItemByShopId = async (shopId) => {
  try{
    const item = await ItemModel.find({ shopId });
    throwBadRequest(!item, Message.ItemNotFound);
    return item;
  }
  catch (error) {
    console.error("Error in getItemByShopId:", error.message);
    throw error;
  }
}
const getItems = async (page, limit) => {
  try {
    const skip = (page - 1) * limit; //tính toán số lượng item cần bỏ qua trong database
    const items = await ItemModel.find()
      .skip(skip)
      .limit(Math.min(limit, 100))
      .exec();

    const totalItems = await ItemModel.countDocuments();
    return {
      items,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: parseInt(page),
    };
  } catch (error) {
    console.error("Error in getItems:", error.message);
    throw error;
  }
};

const deleteItem = async (itemId) => {
  try {
    await ItemModel.findByIdAndDelete(itemId);
  } catch (error) {
    console.error("Error in deleteItem:", error.message);
    throw error;
  }
};
const rateItem = async (itemId, userId, rating) => {
  try {
    console.log("Item ID:", itemId);
    console.log("User ID:", userId);
    console.log("Rating:", rating);

    const item = await ItemModel.findById(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    const existingRating = item.ratings.find(
      (r) => r.userId.toString() === userId
    );
    if (existingRating) {
      existingRating.rating = rating;
    } else {
      item.ratings.push({ userId, rating });
    }

    const totalrate = item.ratings.reduce((acc, r) => acc + r.rating, 0);
    item.rate = totalrate / item.ratings.length;

    await item.save();
    return item;
  } catch (error) {
    console.error("Error in rateItem:", error.message);
    throw error;
  }
};
const uploadImageToCloudinary = async (file) => {
  try {
    if (!file) {
      throw new Error("No file uploaded");
    }

    console.log("Uploading file to Cloudinary:", JSON.stringify(file, null, 2));

    if (!file.path) {
      throw new Error("File path is missing");
    }

    console.log("File uploaded to Cloudinary:", file.path);

    return file.path;
  } catch (error) {
    console.error("Error in uploadImageToCloudinary:", error.message);
    throw error;
  }
};

const saveImageToDatabase = async (itemId, imgUrl) => {
  try {
    const item = await ItemModel.findById(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    console.log("Saving image URL to database:", imgUrl);

    item.imgUrl = imgUrl;
    await item.save();

    return item;
  } catch (error) {
    console.error("Error in saveImageToDatabase:", error.message);
    throw error;
  }
};

const uploadVideoToCloudinary = async (file) => {
  try {
    if (!file) {
      throw new Error("No file uploaded");
    }

    console.log("Uploading file to Cloudinary:", JSON.stringify(file, null, 2));

    if (!file.path) {
      throw new Error("File path is missing");
    }

    console.log("File uploaded to Cloudinary:", file.path);

    return file.path;
  } catch (error) {
    console.error("Error in uploadVideoToCloudinary:", error.message);
    throw error;
  }
};

const saveVideoToDatabase = async (itemId, videoUrl) => {
  try {
    const item = await ItemModel.findById(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    console.log("Saving video URL to database:", videoUrl);

    item.videoUrl = videoUrl;
    await item.save();

    return item;
  } catch (error) {
    console.error("Error in saveVideoToDatabase:", error.message);
    throw error;
  }
};

export default {
  createItem,
  searchItems,
  updateItem,
  getItemById,
  getItemByShopId,
  getItems,
  deleteItem,
  rateItem,
  uploadImageToCloudinary,
  saveImageToDatabase,
  uploadVideoToCloudinary,
  saveVideoToDatabase,
};
