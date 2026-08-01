const express = require("express");
const {
  addEmailJob,
  addDelayedEmailJob,
} = require("../controllers/emailController");

const router = express.Router();

router.post("/", addEmailJob);
router.post("/delayed", addDelayedEmailJob);

module.exports = router;