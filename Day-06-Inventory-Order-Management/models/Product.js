const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        sku: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);


// ==========================================
// Indexes
// ==========================================

// Category + Price compound index

productSchema.index({
    category: 1,
    price: 1
});


// Stock index

productSchema.index({
    stock: 1
});


// Created At index

productSchema.index({
    createdAt: -1
});


module.exports = mongoose.model(
    "Product",
    productSchema
);