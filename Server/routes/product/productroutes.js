const express = require("express");

const { verifyToken } = require("../../middleware/verifyToken");
const { verifyAdmin } = require("../../middleware/verifyAdmin");

const {
  getAllProducts,
  getProductById,
  getCategoriesWithSubcategories,
  getProductsByCategory,
  getAllCategories,
} = require("../../controllers/userControllers/productController");

const {
  addProduct,
  deleteProduct,
} = require("../../controllers/adminControllers/productController");

const router = express.Router();

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

module.exports = router;
