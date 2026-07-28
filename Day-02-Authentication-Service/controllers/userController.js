const User = require("../models/User");

const getProfile = async (req, res) => {

    res.status(200).json({
        message: "Profile fetched successfully",
        user: req.user
    });

};

const getAllUsers = async (req, res, next) => {

    try {

        const users = await User.find().select("-password");

        res.status(200).json({
            totalUsers: users.length,
            users
        });

    } catch (error) {

        next(error);

    }

};

module.exports = {
    getProfile,
    getAllUsers
};