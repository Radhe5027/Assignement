const express = require("express");

const { verifyToken } = require("../../middleware/verifyToken");

const {
  addToCart,
  getCartItems,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../../controllers/cartManagController/cartController");

const router = express.Router();

// Cart Routes
router.post("/api/cart", verifyToken, addToCart);
router.get("/api/cart", verifyToken, getCartItems);
router.put("/api/cart/:itemId", verifyToken, updateCartItem); // allow updates
router.delete("/api/cart", verifyToken, removeCartItem);
router.delete("/api/cart/clear", verifyToken, clearCart); // clear cart route

module.exports = router;
