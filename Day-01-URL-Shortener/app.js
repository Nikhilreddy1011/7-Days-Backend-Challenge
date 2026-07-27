require("dotenv").config();

const express = require("express");

const connectDB = require("./config/db");
const urlRoutes = require("./routes/urlRoutes");
const { redirectUrl } = require("./controllers/urlController");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "URL Shortener API is running"
    });
});

app.use("/api", urlRoutes);

app.get("/:shortCode", redirectUrl);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});