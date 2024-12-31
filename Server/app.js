require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes/routes");
const sequelize = require("./database/db.js"); // import the db connection
const Users = require("./model/users.js");
const UserRole = require("./model/user_roles.js");
const Wishlist = require("./model/wishlist.js");
const ShippingAddress = require("./model/shipping_adress.js");
const Product = require("./model/products.js");
const ProductVariant = require("./model/product_variants.js");
const Orders = require("./model/orders.js");
const OrderShippingAddress = require("./model/order_shipping_adress.js");
const OrderItem = require("./model/order_items.js");
const Category = require("./model/categories.js");
const Cart = require("./model/carts.js");

const app = express(); // create an instance of Express

// Middleware setup
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data
app.use(express.json()); // To parse JSON bodies
app.use(cookieParser());

//Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Test route
app.get("/test", (req, res) => {
  res.send("Server is working!");
});

// Use all routes from routes.js
app.use("/", routes); // it will apply all the routes defined in routes.js

// Handle 404 for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});

// Define model associations
const defineAssociations = () => {
  // Example: Product has many ProductVariants
  Product.hasMany(ProductVariant, { foreignKey: "product_id", as: "variants" });
  ProductVariant.belongsTo(Product, { foreignKey: "product_id" });
  Product.hasMany(OrderItem, { foreignKey: "product_id", as: "OrderItems" });
  ProductVariant.hasMany(OrderItem, {
    foreignKey: "product_variant_id",
    as: "OrderItems",
  });
  Orders.hasMany(OrderItem, { foreignKey: "order_id", as: "OrderItems" });

  // Add other associations here as needed
  Users.belongsTo(UserRole, { foreignKey: "role_id" });
  UserRole.hasMany(Users, { foreignKey: "role_id" });

  // Add more associations as needed
};

// Connect to the database and sync models
const dbName = process.env.DB_NAME; // Your database name from .env

// Create database if it doesn't exist
const createDatabase = async () => {
  try {
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS "${dbName}";`);
    console.log(`Database ${dbName} checked/created.`);
  } catch (error) {
    console.error("Error creating database:", error);
  }
};

const startServer = async () => {
  try {
    await sequelize.authenticate(); // Connect to the database
    console.log("Database connected...");

    defineAssociations();

    await sequelize.sync(); // Sync the models with the database
    console.log("All models synced with the database");

    // Start the server after successful DB connection
    const PORT = process.env.APP_PORT || 3000; // Define the port number
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

startServer();
