const express = require("express");

const fileRoutes = require("./routes/fileRoutes");

const app = express();

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

// File routes
app.use("/api/files", fileRoutes);

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {

    res.json({
        message: "Day 5 File Upload & Storage Service API"
    });

});

module.exports = app;