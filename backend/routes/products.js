const express = require("express");
const { getProducts } = require("../controllers/products");
const router = express.Router();


// get all products routes
router.get("/", getProducts);

module.exports = router;
