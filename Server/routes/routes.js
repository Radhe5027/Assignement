const express = require("express");
const {
  signupUsers,
  loginUsers,
  logoutUsers,
} = require("../controllers/userControllers/userController");
const { verifyToken } = require("../middleware/verifyToken");
const { verifyAdmin } = require("../middleware/verifyAdmin");
const {
  getAllProducts,
  getProductById,
  getCategoriesWithSubcategories,
  getProductsByCategory,
  getAllCategories,
} = require("../controllers/userControllers/productController");

const {
  addToCart,
  getCartItems,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartManagController/cartController");

const {
  addProduct,
  deleteProduct,
} = require("../controllers/adminControllers/productController");

const {
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/adminControllers/userController");

const {
  placeOrder,
  deleteOrder,
  getOrders,
} = require("../controllers/cartManagController/ordersController");

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/cartManagController/wishlistController");

const ShippingAddressController = require("../controllers/cartManagController/shippingAddressController");

const router = express.Router();

// User Authentication Routes
router.post("/api/signup", signupUsers);
router.post("/api/login", loginUsers);
router.post("/api/logout", logoutUsers);

// Product Routes
router.post("/api/products", verifyToken, verifyAdmin, addProduct);
router.get("/api/products", getAllProducts);
router.get("/api/products/subcategory/:subcategoryId", getProductsByCategory);
router.get("/api/categories", getAllCategories);
router.get(
  "/api/categories-with-subcategories",
  getCategoriesWithSubcategories
);
router.get("/api/products/:id", getProductById);
//router.put('/api/products/:id', verifyToken, verifyAdmin,updateProduct);
router.delete("/api/products/:id", verifyToken, verifyAdmin, deleteProduct);

// Cart Routes
router.post("/api/cart", verifyToken, addToCart);
router.get("/api/cart", verifyToken, getCartItems);
router.put("/api/cart/:itemId", verifyToken, updateCartItem); // allow updates
router.delete("/api/cart", verifyToken, removeCartItem);
router.delete("/api/cart/clear", verifyToken, clearCart); // clear cart route

// shipping address routes
router.post(
  "/api/addresses",
  verifyToken,
  ShippingAddressController.createShippingAddress
); // create new shipping address for a user
router.get(
  "/api/addresses",
  verifyToken,
  ShippingAddressController.getShippingAddresses
); // get all shipping addresses for specific user
router.put(
  "/api/addresses/:id",
  ShippingAddressController.updateShippingAddress
); // update an existing shipping address by ID
router.delete(
  "/api/addresses/:id",
  ShippingAddressController.deleteShippingAddress
); // delete a specific shipping adress by id

//final placed order routes
router.post("/api/placeorder", verifyToken, placeOrder);
router.get("/api/getorders/:user_id", verifyToken, getOrders);
router.delete("/api/deleteplacedorder/:orderId", deleteOrder);

//Wishlist routes
router.post("/api/wishlist", verifyToken, addToWishlist);
router.get("/api/wishlist", verifyToken, getWishlist);
router.delete("/api/wishlist/:wishlistItemId", verifyToken, removeFromWishlist);

// User Role Management Routes
router.post("/api/user-roles", verifyToken, verifyAdmin, updateUserRole);
router.get("/api/user-roles", verifyToken, verifyAdmin, getAllUsers);
router.delete("/api/user-roles/:id", verifyToken, verifyAdmin, deleteUser);

module.exports = router;
