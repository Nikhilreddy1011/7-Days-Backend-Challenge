const express = require("express");

const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductStats,
    getCategoryStats
} = require("../controllers/productController");

const router = express.Router();


// ==========================================
// Create Product
// ==========================================

router.post(
    "/",
    createProduct
);


// ==========================================
// Get All Products
// ==========================================

router.get(
    "/",
    getProducts
);


// ==========================================
// Product Statistics
// ==========================================

router.get(
    "/stats",
    getProductStats
);


// ==========================================
// Category Statistics
// ==========================================

router.get(
    "/stats/categories",
    getCategoryStats
);


// ==========================================
// Get Single Product
// ==========================================

router.get(
    "/:id",
    getProduct
);


// ==========================================
// Update Product
// ==========================================

router.put(
    "/:id",
    updateProduct
);


// ==========================================
// Delete Product
// ==========================================

router.delete(
    "/:id",
    deleteProduct
);


module.exports = router;