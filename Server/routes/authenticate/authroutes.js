const express = require("express");
const {
  signupUsers,
  loginUsers,
  logoutUsers,
} = require("../../controllers/userControllers/userController");

const { verifyToken } = require("../../middleware/verifyToken");
const { verifyAdmin } = require("../../middleware/verifyAdmin");

const router = express.Router();

// User Authentication Routes
router.post("/api/signup", signupUsers);
router.post("/api/login", loginUsers);
router.post("/api/logout", logoutUsers);

module.exports = router;
