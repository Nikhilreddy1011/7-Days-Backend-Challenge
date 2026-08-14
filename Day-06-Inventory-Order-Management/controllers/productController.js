const mongoose = require("mongoose");

const Product = require("../models/Product");

// ==========================================
// Create Product
// ==========================================

const createProduct = async (req, res, next) => {

    try {

        const {
            name,
            sku,
            description,
            price,
            stock,
            category
        } = req.body;

        const product = await Product.create({

            name,
            sku,
            description,
            price,
            stock,
            category

        });

        res.status(201).json({

            message: "Product created successfully",

            product

        });

    } catch (error) {

        next(error);

    }

};


// ==========================================
// Get All Products
// ==========================================

const getProducts = async (req, res, next) => {

    try {

        const {
            search,
            category,
            minPrice,
            maxPrice,
            minStock,
            maxStock,

            page = 1,
            limit = 10,

            sort = "createdAt",
            order = "desc"

        } = req.query;


        // ==========================================
        // Build Filter
        // ==========================================

        const filter = {};


        // ==========================================
        // Search
        // ==========================================

        if (search) {

            filter.$or = [

                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    sku: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                }

            ];

        }


        // ==========================================
        // Category Filter
        // ==========================================

        if (category) {

            filter.category = {

                $regex: category,
                $options: "i"

            };

        }


        // ==========================================
        // Price Filter
        // ==========================================

        if (minPrice || maxPrice) {

            filter.price = {};

            if (minPrice) {

                filter.price.$gte =
                    Number(minPrice);

            }

            if (maxPrice) {

                filter.price.$lte =
                    Number(maxPrice);

            }

        }


        // ==========================================
        // Stock Filter
        // ==========================================

        if (minStock || maxStock) {

            filter.stock = {};

            if (minStock) {

                filter.stock.$gte =
                    Number(minStock);

            }

            if (maxStock) {

                filter.stock.$lte =
                    Number(maxStock);

            }

        }


        // ==========================================
        // Pagination
        // ==========================================

        const currentPage =
            Math.max(Number(page), 1);

        const itemsPerPage =
            Math.max(Number(limit), 1);

        const skip =
            (currentPage - 1) * itemsPerPage;


        // ==========================================
        // Sorting
        // ==========================================

        const sortOrder =
            order.toLowerCase() === "asc"
                ? 1
                : -1;

        const sortOptions = {};

        sortOptions[sort] = sortOrder;


        // ==========================================
        // Count Matching Products
        // ==========================================

        const totalProducts =
            await Product.countDocuments(filter);


        // ==========================================
        // Get Products
        // ==========================================

        const products =
            await Product
                .find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(itemsPerPage);


        // ==========================================
        // Pagination Information
        // ==========================================

        const totalPages =
            Math.ceil(
                totalProducts / itemsPerPage
            );


        // ==========================================
        // Response
        // ==========================================

        res.status(200).json({

            count: products.length,

            pagination: {

                totalProducts,

                totalPages,

                currentPage,

                itemsPerPage,

                hasNextPage:
                    currentPage < totalPages,

                hasPreviousPage:
                    currentPage > 1

            },

            sorting: {

                field: sort,

                order:
                    order.toLowerCase() === "asc"
                        ? "asc"
                        : "desc"

            },

            products

        });

    } catch (error) {

        next(error);

    }

};

// ==========================================
// Get Single Product
// ==========================================

const getProduct = async (req, res, next) => {

    try {

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {

            return res.status(400).json({

                message: "Invalid product ID"

            });

        }

        const product = await Product.findById(id);

        if (!product) {

            return res.status(404).json({

                message: "Product not found"

            });

        }

        res.status(200).json({

            product

        });

    } catch (error) {

        next(error);

    }

};


// ==========================================
// Update Product
// ==========================================

const updateProduct = async (req, res, next) => {

    try {

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {

            return res.status(400).json({

                message: "Invalid product ID"

            });

        }

        const product =
            await Product.findByIdAndUpdate(

                id,

                req.body,

                {
                    new: true,
                    runValidators: true
                }

            );

        if (!product) {

            return res.status(404).json({

                message: "Product not found"

            });

        }

        res.status(200).json({

            message: "Product updated successfully",

            product

        });

    } catch (error) {

        next(error);

    }

};


// ==========================================
// Delete Product
// ==========================================

const deleteProduct = async (req, res, next) => {

    try {

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {

            return res.status(400).json({

                message: "Invalid product ID"

            });

        }

        const product =
            await Product.findByIdAndDelete(id);

        if (!product) {

            return res.status(404).json({

                message: "Product not found"

            });

        }

        res.status(200).json({

            message: "Product deleted successfully",

            product

        });

    } catch (error) {

        next(error);

    }

};
// ==========================================
// Product Statistics
// ==========================================

const getProductStats = async (req, res, next) => {

    try {

        const stats = await Product.aggregate([

            {
                $group: {

                    _id: null,

                    totalProducts: {
                        $sum: 1
                    },

                    totalStock: {
                        $sum: "$stock"
                    },

                    averagePrice: {
                        $avg: "$price"
                    },

                    totalInventoryValue: {
                        $sum: {
                            $multiply: [
                                "$price",
                                "$stock"
                            ]
                        }
                    }

                }

            }

        ]);

        res.status(200).json({

            stats:
                stats[0] || {
                    totalProducts: 0,
                    totalStock: 0,
                    averagePrice: 0,
                    totalInventoryValue: 0
                }

        });

    } catch (error) {

        next(error);

    }

};
// ==========================================
// Category Statistics
// ==========================================

const getCategoryStats = async (req, res, next) => {

    try {

        const stats =
            await Product.aggregate([

                {
                    $group: {

                        _id: "$category",

                        productCount: {
                            $sum: 1
                        },

                        totalStock: {
                            $sum: "$stock"
                        },

                        averagePrice: {
                            $avg: "$price"
                        },

                        totalInventoryValue: {
                            $sum: {
                                $multiply: [
                                    "$price",
                                    "$stock"
                                ]
                            }
                        }

                    }
                },

                {
                    $sort: {
                        totalStock: -1
                    }
                }

            ]);

        res.status(200).json({

            categories: stats

        });

    } catch (error) {

        next(error);

    }

};

module.exports = {

    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductStats,
    getCategoryStats

};