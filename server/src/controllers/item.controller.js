import itemService from "../services/item.service.js";
import httpStatus from "http-status";
import Message from "../utils/message.js";


// Create a new item
export const createItem = async (req, res) => {
    try {
        const newItem = await itemService.createItem(req.body);
        res.status(httpStatus.CREATED).send({
            code: httpStatus.CREATED,
            message: Message.ItemCreated,
            data: newItem,
          });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.BAD_REQUEST).send({
          code: httpStatus.BAD_REQUEST,
          message: Message.ItemCreatedFailed,
        });
    }
};

// Get all items
export const getItems = async (req, res) => {
    try {
        const items = await itemService.getItems();
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
        const item = await itemService.getItemById(req.params.id);
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
        const updateitem = await itemService.updateItem(req.params.id, req.body);
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
        const Itemdelete = await itemService.deleteItem(req.body);
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
