const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");


// ==========================================
// Create Order
// ==========================================

const createOrder = async (req, res, next) => {

    const session = await mongoose.startSession();

    try {

        const {
            customerName,
            customerEmail,
            items
        } = req.body;


        // ==========================================
        // Validate Request
        // ==========================================

        if (
            !customerName ||
            !customerEmail ||
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.status(400).json({

                message:
                    "Customer details and order items are required"

            });

        }


        // ==========================================
        // Start Transaction
        // ==========================================

        session.startTransaction();


        const orderItems = [];

        let totalAmount = 0;


        // ==========================================
        // Process Each Product
        // ==========================================

        for (const item of items) {

            if (
                !mongoose.isValidObjectId(
                    item.product
                )
            ) {

                throw new Error(
                    `Invalid product ID: ${item.product}`
                );

            }


            if (
                !Number.isInteger(item.quantity) ||
                item.quantity < 1
            ) {

                throw new Error(
                    "Quantity must be at least 1"
                );

            }


            // ==========================================
            // Atomic Stock Deduction
            // ==========================================

            const product =
                await Product.findOneAndUpdate(

                    {
                        _id: item.product,

                        stock: {
                            $gte: item.quantity
                        },

                        isActive: true
                    },

                    {
                        $inc: {
                            stock: -item.quantity
                        }
                    },

                    {
                        new: true,
                        session
                    }

                );


            // ==========================================
            // Product Validation
            // ==========================================

            if (!product) {

                throw new Error(
                    `Product not found, inactive, or insufficient stock: ${item.product}`
                );

            }


            // ==========================================
            // Calculate Item Total
            // ==========================================

            const itemTotal =
                product.price * item.quantity;


            orderItems.push({

                product: product._id,

                quantity: item.quantity,

                price: product.price

            });


            totalAmount += itemTotal;

        }


        // ==========================================
        // Create Order Inside Transaction
        // ==========================================

        const orders = await Order.create(
            [
                {
                    customerName,

                    customerEmail,

                    items: orderItems,

                    totalAmount
                }
            ],
            {
                session
            }
        );


        const order = orders[0];


        // ==========================================
        // Commit Transaction
        // ==========================================

        await session.commitTransaction();


        // ==========================================
        // Populate Product Details
        // ==========================================

        await order.populate(
            "items.product"
        );


        res.status(201).json({

            message:
                "Order created successfully",

            order

        });

    } catch (error) {

        // ==========================================
        // Rollback Transaction
        // ==========================================

        if (session.inTransaction()) {

            await session.abortTransaction();

        }


        console.error(
            "Order creation failed:",
            error.message
        );


        res.status(400).json({

            message: error.message

        });

    } finally {

        // ==========================================
        // End Session
        // ==========================================

        await session.endSession();

    }

};


// ==========================================
// Get All Orders
// ==========================================

const getOrders = async (req, res, next) => {

    try {

        const orders = await Order
            .find()
            .populate(
                "items.product"
            )
            .sort({
                createdAt: -1
            });


        res.status(200).json({

            count: orders.length,

            orders

        });

    } catch (error) {

        next(error);

    }

};


// ==========================================
// Get Single Order
// ==========================================

const getOrder = async (req, res, next) => {

    try {

        const { id } = req.params;


        if (!mongoose.isValidObjectId(id)) {

            return res.status(400).json({

                message:
                    "Invalid order ID"

            });

        }


        const order = await Order
            .findById(id)
            .populate(
                "items.product"
            );


        if (!order) {

            return res.status(404).json({

                message:
                    "Order not found"

            });

        }


        res.status(200).json({

            order

        });

    } catch (error) {

        next(error);

    }

};
// ==========================================
// Cancel Order
// ==========================================

const cancelOrder = async (req, res, next) => {

    const session = await mongoose.startSession();

    try {

        const { id } = req.params;


        // ==========================================
        // Validate Order ID
        // ==========================================

        if (!mongoose.isValidObjectId(id)) {

            return res.status(400).json({

                message: "Invalid order ID"

            });

        }


        // ==========================================
        // Start Transaction
        // ==========================================

        session.startTransaction();


        // ==========================================
        // Find Order
        // ==========================================

        const order = await Order
            .findById(id)
            .session(session);


        if (!order) {

            throw new Error(
                "Order not found"
            );

        }


        // ==========================================
        // Check Order Status
        // ==========================================

        if (order.status === "cancelled") {

            throw new Error(
                "Order is already cancelled"
            );

        }


        if (
            order.status === "shipped" ||
            order.status === "delivered"
        ) {

            throw new Error(
                "Cannot cancel a shipped or delivered order"
            );

        }


        // ==========================================
        // Restore Product Stock
        // ==========================================

        for (const item of order.items) {

            await Product.findByIdAndUpdate(

                item.product,

                {
                    $inc: {
                        stock: item.quantity
                    }
                },

                {
                    session
                }

            );

        }


        // ==========================================
        // Update Order Status
        // ==========================================

        order.status = "cancelled";

        await order.save({
            session
        });


        // ==========================================
        // Commit Transaction
        // ==========================================

        await session.commitTransaction();


        // ==========================================
        // Populate Product Details
        // ==========================================

        await order.populate(
            "items.product"
        );


        res.status(200).json({

            message:
                "Order cancelled successfully",

            order

        });

    } catch (error) {

        // ==========================================
        // Rollback
        // ==========================================

        if (session.inTransaction()) {

            await session.abortTransaction();

        }


        console.error(
            "Order cancellation failed:",
            error.message
        );


        res.status(400).json({

            message: error.message

        });

    } finally {

        await session.endSession();

    }

};
// ==========================================
// Update Order Status
// ==========================================

const updateOrderStatus = async (req, res, next) => {

    try {

        const { id } = req.params;

        const { status } = req.body;


        // ==========================================
        // Validate Order ID
        // ==========================================

        if (!mongoose.isValidObjectId(id)) {

            return res.status(400).json({

                message: "Invalid order ID"

            });

        }


        // ==========================================
        // Allowed Statuses
        // ==========================================

        const allowedStatuses = [
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled"
        ];


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({

                message:
                    "Invalid order status"

            });

        }


        // ==========================================
        // Find Order
        // ==========================================

        const order = await Order.findById(id);


        if (!order) {

            return res.status(404).json({

                message:
                    "Order not found"

            });

        }


        const currentStatus =
            order.status;


        // ==========================================
        // Validate Status Transition
        // ==========================================

        const validTransitions = {

            pending: [
                "confirmed",
                "cancelled"
            ],

            confirmed: [
                "shipped",
                "cancelled"
            ],

            shipped: [
                "delivered"
            ],

            delivered: [],

            cancelled: []

        };


        const allowedNextStatuses =
            validTransitions[currentStatus];


        if (
            !allowedNextStatuses.includes(status)
        ) {

            return res.status(400).json({

                message:
                    `Cannot change order status from ${currentStatus} to ${status}`

            });

        }


        // ==========================================
        // Update Status
        // ==========================================

        order.status = status;

        await order.save();


        // ==========================================
        // Populate Product
        // ==========================================

        await order.populate(
            "items.product"
        );


        res.status(200).json({

            message:
                "Order status updated successfully",

            order

        });

    } catch (error) {

        next(error);

    }

};

module.exports = {

    createOrder,
    getOrders,
    getOrder,
    cancelOrder,
    updateOrderStatus

};