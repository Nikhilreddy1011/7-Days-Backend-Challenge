const express = require("express");
const emailRoutes = require("./routes/emailRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Day 4 - Email Queue & Background Job Service",
  });
});

app.use("/api/emails", emailRoutes);

module.exports = app;