const express = require("express");

const {
    getProfile,
    getAllUsers
} = require("../controllers/userController");

const {
    protect
} = require("../middleware/authMiddleware");

const {
    authorize
} = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/profile", protect, getProfile);

router.get(
    "/",
    protect,
    authorize("admin"),
    getAllUsers
);

module.exports = router;