require("dotenv").config();

const express = require("express");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const userRoutes = require("./routes/userRoutes");

const errorHandler = require("./middleware/errorMiddleware");

const app = express();

connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);  

app.use(errorHandler);

app.get("/", (req, res) => {
    res.json({
        message: "Authentication API Running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});