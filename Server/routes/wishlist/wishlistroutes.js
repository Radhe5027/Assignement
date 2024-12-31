const express = require("express");
const { verifyToken } = require("../../middleware/verifyToken");

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../../controllers/cartManagController/wishlistController");

const router = express.Router();

//Wishlist routes
router.post("/api/wishlist", verifyToken, addToWishlist);
router.get("/api/wishlist", verifyToken, getWishlist);
router.delete("/api/wishlist/:wishlistItemId", verifyToken, removeFromWishlist);

module.exports = router;
