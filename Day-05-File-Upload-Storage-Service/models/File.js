const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
    {
        originalName: {
            type: String,
            required: true
        },

        fileName: {
            type: String,
            required: true
        },

        mimeType: {
            type: String,
            required: true
        },

        size: {
            type: Number,
            required: true
        },

        path: {
            type: String,
            required: true
        },

        cloudinaryPublicId: {
            type: String,
            default: null
        },

        cloudinaryUrl: {
            type: String,
            default: null
        },

        cloudinaryResourceType: {
            type: String,
            default: null
        },

        cloudinaryFormat: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "File",
    fileSchema
);