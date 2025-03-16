import { Schema, model } from 'mongoose';
import { ItemTypeEnum } from '../utils/constant.js';

const itemSchema = new Schema({
    shopId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    type: {
        type: ItemTypeEnum,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    comments: [
        {
            type: Schema.ObjectId,
            ref: 'Comment',            
        }
    ],
    quantity: {
        type: Number,
        required: true,
    },
})

export default model('Item', itemSchema);