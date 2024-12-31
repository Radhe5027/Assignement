const express = require("express");

const { verifyToken } = require("../../middleware/verifyToken");

const ShippingAddressController = require("../../controllers/cartManagController/shippingAddressController");

const router = express.Router();

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

module.exports = router;
