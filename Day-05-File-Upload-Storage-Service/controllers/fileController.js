const mongoose = require("mongoose");
const fs = require("fs");

const File = require("../models/File");
const cloudinary = require("../config/cloudinary");


const uploadFile = async (req, res, next) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                message: "Please upload a file"
            });

        }

        // ==========================================
        // Upload file to Cloudinary
        // ==========================================

        const result = await cloudinary.uploader.upload(
            req.file.path,
            {
                resource_type: "auto",

                folder: "day-05-file-upload"
            }
        );

        // ==========================================
        // Save metadata in MongoDB
        // ==========================================

        const file = await File.create({

            originalName: req.file.originalname,

            fileName: req.file.filename,

            mimeType: req.file.mimetype,

            size: req.file.size,

            path: req.file.path,

            cloudinaryPublicId: result.public_id,

            cloudinaryUrl: result.secure_url,

            cloudinaryResourceType: result.resource_type,

            cloudinaryFormat: result.format

        });

        // ==========================================
        // Send response
        // ==========================================

        res.status(201).json({

            message: "File uploaded successfully",

            file: {

                id: file._id,

                originalName: file.originalName,

                fileName: file.fileName,

                mimeType: file.mimeType,

                size: file.size,

                cloudinaryPublicId:
                    file.cloudinaryPublicId,

                cloudinaryUrl:
                    file.cloudinaryUrl,

                cloudinaryResourceType:
                    file.cloudinaryResourceType,

                cloudinaryFormat:
                    file.cloudinaryFormat,

                uploadedAt: file.createdAt

            }

        });

    } catch (error) {

        console.error(
            "Cloudinary upload error:",
            error.message
        );

        next(error);

    }

};

// ==========================================
// Stream File
// ==========================================

const streamFile = async (req, res, next) => {

    try {

        const { id } = req.params;

        // ==========================================
        // Validate MongoDB ObjectId
        // ==========================================

        if (!mongoose.isValidObjectId(id)) {

            return res.status(400).json({

                message: "Invalid file ID"

            });

        }

        // ==========================================
        // Find File
        // ==========================================

        const file = await File.findById(id);

        if (!file) {

            return res.status(404).json({

                message: "File not found"

            });

        }

        // ==========================================
        // Check Cloudinary URL
        // ==========================================

        if (!file.cloudinaryUrl) {

            return res.status(404).json({

                message: "Cloudinary file URL not found"

            });

        }

        // ==========================================
        // Redirect to Cloudinary
        // ==========================================

        res.redirect(file.cloudinaryUrl);

    } catch (error) {

        console.error(
            "Stream file error:",
            error.message
        );

        next(error);

    }

};


// ==========================================
// Download File
// ==========================================

const downloadFile = async (req, res, next) => {

    try {

        const { id } = req.params;

        // ==========================================
        // Validate MongoDB ObjectId
        // ==========================================

        if (!mongoose.isValidObjectId(id)) {

            return res.status(400).json({

                message: "Invalid file ID"

            });

        }

        // ==========================================
        // Find File
        // ==========================================

        const file = await File.findById(id);

        if (!file) {

            return res.status(404).json({

                message: "File not found"

            });

        }

        // ==========================================
        // Check Cloudinary URL
        // ==========================================

        if (!file.cloudinaryUrl) {

            return res.status(404).json({

                message: "Cloudinary file URL not found"

            });

        }

        // ==========================================
        // Set Download Headers
        // ==========================================

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${file.originalName}"`
        );

        // ==========================================
        // Redirect to Cloudinary
        // ==========================================

        res.redirect(file.cloudinaryUrl);

    } catch (error) {

        console.error(
            "Download file error:",
            error.message
        );

        next(error);

    }

};


// ==========================================
// Delete File
// ==========================================

const deleteFile = async (req, res, next) => {

    try {

        const { id } = req.params;

        // Validate MongoDB ObjectId

        if (!mongoose.isValidObjectId(id)) {

            return res.status(400).json({

                message: "Invalid file ID"

            });

        }

        // Find file metadata

        const file = await File.findById(id);

        if (!file) {

            return res.status(404).json({

                message: "File not found"

            });

        }

        // Check physical file

        if (fs.existsSync(file.path)) {

            fs.unlinkSync(file.path);

        }

        // Delete metadata from MongoDB

        await File.findByIdAndDelete(id);

        res.status(200).json({

            message: "File deleted successfully",

            file: {

                id: file._id,

                originalName: file.originalName

            }

        });

    } catch (error) {

        next(error);

    }

};


module.exports = {

    uploadFile,

    streamFile,

    downloadFile,

    deleteFile

};