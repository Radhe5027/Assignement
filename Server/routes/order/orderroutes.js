const express = require("express");

const { verifyToken } = require("../../middleware/verifyToken");

const {
  placeOrder,
  deleteOrder,
  getOrders,
} = require("../../controllers/cartManagController/ordersController");

const router = express.Router();

//final placed order routes
router.post("/api/placeorder", verifyToken, placeOrder);
router.get("/api/getorders/:user_id", verifyToken, getOrders);
router.delete("/api/deleteplacedorder/:orderId", deleteOrder);

module.exports = router;
