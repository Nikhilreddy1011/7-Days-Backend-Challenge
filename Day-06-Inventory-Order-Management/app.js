const express = require("express");

const productRoutes =
    require("./routes/productRoutes");

const orderRoutes =
    require("./routes/orderRoutes");

const app = express();


// ==========================================
// Body Parser
// ==========================================

app.use(express.json());


// ==========================================
// Home Route
// ==========================================

app.get("/", (req, res) => {

    res.json({

        message:
            "Day 6 Inventory & Order Management API"

    });

});


// ==========================================
// Product Routes
// ==========================================

app.use(
    "/api/products",
    productRoutes
);


// ==========================================
// Order Routes
// ==========================================

app.use(
    "/api/orders",
    orderRoutes
);


// ==========================================
// Error Handler
// ==========================================

app.use((err, req, res, next) => {

    console.error(
        "Error:",
        err.message
    );

    res.status(500).json({

        message:
            err.message ||
            "Internal server error"

    });

});


module.exports = app;