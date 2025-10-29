const express = require("express");
const router = express.Router();
const {
  addToCart,
  deleteCartItem,
  getCart
} = require("../controllers/cartController");

// add to cart route
router.post("/", addToCart);

// delete to cart item route
router.delete("/:id", deleteCartItem);

// get  cart route
router.get("/", getCart);

module.exports = router;
