import ShopService from "../services/shop.service.js";
import httpStatus from "http-status";
import Message from "../utils/message.js";

// Create a new Shop
export const createShop = async (req, res) => {
  try {
    const newShop = await ShopService.createShop(req.body);
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
    const limit = parseInt(req.query.limit) || PaginationEnum.DEFAULT_LIMIT;
    const Shops = await ShopService.getShops(page, limit);
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
