const express = require("express");
const router = express.Router();
const { checkout, getReceipts } = require("../controllers/checkoutController");

// Routes
router.post("/checkout", checkout);
router.get("/receipts", getReceipts);

module.exports = router;
