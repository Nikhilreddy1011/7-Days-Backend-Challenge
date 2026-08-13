const multer = require("multer");
const path = require("path");
const fs = require("fs");


// ==========================================
// Upload Directory
// ==========================================

const uploadDirectory = path.join(
    __dirname,
    "../uploads"
);

if (!fs.existsSync(uploadDirectory)) {

    fs.mkdirSync(uploadDirectory, {
        recursive: true
    });

}


// ==========================================
// Storage
// ==========================================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, uploadDirectory);

    },

    filename: function (req, file, cb) {

        const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname).toLowerCase()}`;

        cb(null, uniqueName);

    }

});


// ==========================================
// Allowed MIME Types
// ==========================================

const allowedMimeTypes = [

    "image/jpeg",

    "image/png",

    "image/webp",

    "image/gif",

    "application/pdf"

];


// ==========================================
// Allowed Extensions
// ==========================================

const allowedExtensions = [

    ".jpg",

    ".jpeg",

    ".png",

    ".webp",

    ".gif",

    ".pdf"

];


// ==========================================
// File Filter
// ==========================================

const fileFilter = (req, file, cb) => {

    const extension =
        path.extname(
            file.originalname
        ).toLowerCase();

    const validMimeType =
        allowedMimeTypes.includes(
            file.mimetype
        );

    const validExtension =
        allowedExtensions.includes(
            extension
        );


    if (
        validMimeType &&
        validExtension
    ) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG, WEBP, GIF and PDF files are allowed."
            ),
            false
        );

    }

};


// ==========================================
// Multer Configuration
// ==========================================

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 5 * 1024 * 1024

    }

});


module.exports = upload;