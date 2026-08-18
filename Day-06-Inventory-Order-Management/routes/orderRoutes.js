const express = require("express");

const {
    createOrder,
    getOrders,
    getOrder,
    cancelOrder,
    updateOrderStatus
} = require("../controllers/orderController");

const router = express.Router();


// ==========================================
// Create Order
// ==========================================

router.post(
    "/",
    createOrder
);


// ==========================================
// Get All Orders
// ==========================================

router.get(
    "/",
    getOrders
);


// ==========================================
// Cancel Order
// ==========================================

router.patch(
    "/:id/cancel",
    cancelOrder
);


// ==========================================
// Update Order Status
// ==========================================

router.patch(
    "/:id/status",
    updateOrderStatus
);


// ==========================================
// Get Single Order
// ==========================================

router.get(
    "/:id",
    getOrder
);


module.exports = router;