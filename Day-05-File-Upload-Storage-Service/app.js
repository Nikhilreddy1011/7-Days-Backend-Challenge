const express = require("express");

const fileRoutes = require("./routes/fileRoutes");

const app = express();


// ==========================================
// Body Parsers
// ==========================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ==========================================
// File Routes
// ==========================================

app.use(
    "/api/files",
    fileRoutes
);


// ==========================================
// Uploaded Files
// ==========================================

app.use(
    "/uploads",
    express.static("uploads")
);


// ==========================================
// Home Route
// ==========================================

app.get("/", (req, res) => {

    res.json({

        message:
            "Day 5 File Upload & Storage Service API"

    });

});


// ==========================================
// Error Handler
// ==========================================

app.use((err, req, res, next) => {

    console.error(
        "Error:",
        err.message
    );

    if (err.name === "MulterError") {

        if (err.code === "LIMIT_FILE_SIZE") {

            return res.status(400).json({

                message:
                    "File size must be less than 5 MB."

            });

        }

        return res.status(400).json({

            message: err.message

        });

    }


    return res.status(500).json({

        message:
            err.message ||
            "Internal server error"

    });

});


module.exports = app;