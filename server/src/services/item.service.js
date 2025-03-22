import ItemModel from "../models/item.model.js";
import { throwBadRequest } from "../utils/error.util.js";
import Message from "../utils/message.js";

const createItem = async (itemData) => {
  const newItem = await ItemModel.create(itemData);
  return newItem;
};

const updateItem = async (itemId, itemData) => {
  const item = await ItemModel.findById(itemId);
  throwBadRequest(!item, Message.ItemNotFound);
  return ItemModel.findByIdAndUpdate(itemId, itemData, { new: true });
};

const getItemById = async (ItemId) => {
  const Item = await ItemModel.findById(ItemId);
  throwBadRequest(!Item, Message.ItemNotFound);
  return Item;
};

const getItems = async () => {
  const Items = await ItemModel.find();
  return Items;
};

const deleteItem = async (ItemId) => {
  await ItemModel.findByIdAndDelete(ItemId);
};

export default {
  createItem,
  updateItem,
  getItemById,
  getItems,
  deleteItem,
};
