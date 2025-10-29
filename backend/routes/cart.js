const express = require("express");
const router = express.Router();
const {
  addToCart,
  deleteCartItem,
  getCart,
  updateCartItem
} = require("../controllers/cartController");

// add to cart route
router.post("/", addToCart);

// delete to cart item route
router.delete("/:id", deleteCartItem);

// get  cart route
router.get("/", getCart);

// update cart quantity
router.put("/:id", updateCartItem);

module.exports = router;
