const express = require('express');
const { signupUsers, loginUsers, logoutUsers } = require('../controllers/userControllers/userController');
const { verifyToken} = require('../middleware/verifyToken');
const {verifyAdmin } = require('../middleware/verifyAdmin');
const {
    getAllProducts,
    getProductById,
    getProductsByCategory
} = require('../controllers/userControllers/productController');

const {
    addToCart,
    getCartItems,
    updateCartItem,
    removeCartItem,
    clearCart
} = require('../controllers/cartManagController/cartController');


const {
    addProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/adminControllers/productController');


const {
    getAllUsers,
    updateUserRole,
    deleteUser
} = require('../controllers/adminControllers/userController');

const router = express.Router();

// User Authentication Routes
router.post('/api/signup', signupUsers);
router.post('/api/login', loginUsers);
router.post('/api/logout', logoutUsers);

// Product Routes
router.post('/api/products', verifyToken, verifyAdmin, addProduct);
router.get('/api/products', getAllProducts);
router.get('/api/products/:id',getProductById);
router.put('/api/products/:id', verifyToken, verifyAdmin,updateProduct);
router.delete('/api/products/:id', verifyToken, verifyAdmin, deleteProduct);

// Cart Routes
router.post('/api/cart', verifyToken, addToCart);
router.get('/api/cart', verifyToken, getCartItems);
router.put('/api/cart/:itemId', verifyToken, updateCartItem); // allow updates
router.delete('/api/cart/:itemId', verifyToken, removeCartItem);
router.delete('/api/cart/clear', verifyToken, clearCart); // clear cart route

// Order Routes
router.post('/api/orders', verifyToken, createOrder);
router.get('/api/orders', verifyToken, verifyAdmin, getAllOrders);
router.get('/api/orders/:id', verifyToken, verifyAdmin, getOrderById);
router.put('/api/orders/:id', verifyToken, verifyAdmin, updateOrder);
router.delete('/api/orders/:id', verifyToken, verifyAdmin, deleteOrder);

// User Role Management Routes
router.post('/api/user-roles', verifyToken, verifyAdmin, updateUserRole);
router.get('/api/user-roles', verifyToken, verifyAdmin, getAllUsers);
router.delete('/api/user-roles/:id', verifyToken, verifyAdmin, deleteUser);

module.exports = router;
