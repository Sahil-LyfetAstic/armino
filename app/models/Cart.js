//create a cart model

import mongoose from "mongoose";


//create a cart model with user id name email item_qunatity subtotal discount total_tax grand_total

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    total_items: {
        type: Number,
        required: true,
        trim: true,
        default: 0,
    },
    total_price: {
        type: Number,
        required: true,
        trim: true,
        default: 0,
    },
    discount: {
        type: Number,
        required: true,
        trim: true,
        default: 0,
    },
    total_tax: {
        type: Number,
        required: true,
        trim: true,
        default: 0,
    },
    grand_total: {
        type: Number,
        required: true,
        trim: true,
        default: 0,
    },
    scores: [],
    cart_items: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                trim: true,
                default: 0,
            },
            price:{
                type: Number,
                required: true,
                trim: true,
            },
            subtotal: {
                type: Number,
                required: true,
                trim: true,
                default: 0,
            },
            discount: {
                type: Number,
                required: true,
                trim: true,
                default: 0,
            },
            grand_total: {
                type: Number,
                required: true,
                trim: true,
                default: 0,
            },
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },

});


export default mongoose.model("Cart", cartSchema);