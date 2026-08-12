require("dotenv").config();

const app = require("./app");
const cloudinary = require("./config/cloudinary");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;


// ==========================================
// Check Cloudinary Configuration
// ==========================================

console.log(
    "Cloudinary:",
    process.env.CLOUDINARY_CLOUD_NAME
        ? "Configured"
        : "Not configured"
);


const startServer = async () => {

    try {

        await connectDB();

        app.listen(PORT, () => {

            console.log(
                `🚀 Server running on port ${PORT}`
            );

        });

    } catch (error) {

        console.error(
            "❌ Server startup failed:",
            error.message
        );

        process.exit(1);

    }

};

startServer();