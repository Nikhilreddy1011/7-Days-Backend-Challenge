const express = require("express");

const upload = require("../middleware/uploadMiddleware");

const {
    uploadFile,
    streamFile,
    downloadFile,
    deleteFile
} = require("../controllers/fileController");

const router = express.Router();


// ==========================================
// Upload File
// ==========================================

router.post(
    "/upload",
    upload.single("file"),
    uploadFile
);


// ==========================================
// Stream File
// ==========================================

router.get(
    "/stream/:id",
    streamFile
);


// ==========================================
// Download File
// ==========================================

router.get(
    "/:id/download",
    downloadFile
);


// ==========================================
// Delete File
// ==========================================

router.delete(
    "/:id",
    deleteFile
);


module.exports = router;