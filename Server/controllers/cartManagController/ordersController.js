const Orders = require("../../model/orders");
const Cart = require("../../model/carts");
const Product = require("../../model/products");
const OrderItem = require("../../model/order_items");
const ProductVariant = require("../../model/product_variants");
const sequelize = require("../../database/db"); // Assuming you have sequelize instance in db.js

// // Utility function to generate unique order number
// const order_number = () => `ORD-${Date.now()}`;

/**
 * Place an order from the cart
 */
exports.placeOrder = async (req, res) => {
  const {
    user_id,
    shipping_amount,
    payment_type = "cod",
    payment_transaction_id,
  } = req.body;

  try {
    // Step 1: Fetch cart items for the given user
    const cartItems = await Cart.findAll({
      where: {
        user_id: user_id,
      },
      include: [
        {
          model: Product,
          attributes: [
            "id",
            "product_name",
            "url_slug",
            "cat_id",
            "description",
            "price",
            "stock_quantity",
            "status",
            "image_url",
          ],
        },
        {
          model: ProductVariant,
          attributes: [
            "id",
            "product_id",
            "color",
            "size",
            "price",
            "stock_quantity",
            "image_url",
          ],
        },
      ],
    });

    // Check if the cart is empty
    if (!cartItems || cartItems.length === 0) {
      return res
        .status(400)
        .json({ error: "Cart is empty, cannot place order" });
    }

    // Step 2: Calculate order details
    let totalAmount = 0;
    let discountAmount = 0; // Add discount logic if needed
    let grossAmount = 0;
    let netAmount = 0;

    // Process cart items to calculate total amount
    const processedItems = [];
    for (const item of cartItems) {
      const productPrice = item.ProductVariant
        ? item.ProductVariant.price
        : item.Product?.price;

      // Check if productPrice is valid
      if (!productPrice) {
        console.error(
          `Missing price for product/variant. Cart item: ${JSON.stringify(
            item
          )}`
        );
        return res
          .status(400)
          .json({ error: "One or more products in the cart are invalid." });
      }

      const itemTotal = productPrice * item.quantity;
      totalAmount += itemTotal;

      // Prepare order item for insertion
      processedItems.push({
        product_id: item.product_id,
        product_variant_id: item.product_variant_id,
        product_name: item.Product.product_name,
        color: item.ProductVariant ? item.ProductVariant.color : null,
        size: item.ProductVariant ? item.ProductVariant.size : null,
        price: productPrice,
        quantity: item.quantity,
        total_amount: itemTotal,
      });
    }

    grossAmount = totalAmount + shipping_amount;
    netAmount = grossAmount - discountAmount; // Apply discounts if any

    // Step 3: Create the order record
    const order = await Orders.create({
      order_number: `ORD-${Date.now()}`, // Unique order number
      user_id: user_id,
      total_amount: totalAmount,
      discount_amount: discountAmount,
      gross_amount: grossAmount,
      shipping_amount: shipping_amount,
      net_amount: netAmount,
      status: "placed", // Order status
      payment_status: "not paid", // Payment status
      payment_type: payment_type,
      payment_transaction_id: payment_transaction_id || null,
    });

    // Step 4: Create order items for each cart item
    const orderItems = processedItems.map((item) => ({
      ...item,
      order_id: order.id, // Link order item to the order
    }));

    // Step 5: Insert order items into the OrderItem table
    await OrderItem.bulkCreate(orderItems);

    // Step 6: Clear the cart after order creation
    await Cart.destroy({
      where: {
        user_id: user_id,
      },
    });

    // Step 7: Return response
    return res.status(201).json({
      message: "Order placed successfully",
      order: order,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ error: "Failed to place order" });
  }
};

/**
Get the placed Order

 */
exports.getOrders = async (req, res) => {
  const { user_id } = req.params;

  try {
    const orders = await Orders.findAll({
      where: { user_id },
      include: [
        {
          model: OrderItem,
          as: "OrderItems",
          include: [
            {
              model: Product,
              attributes: ["id", "product_name", "price", "image_url"],
            },
            {
              model: ProductVariant,
              attributes: ["color", "size", "image_url"],
            },
          ],
        },
      ],
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found for this user." });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching placed orders:", error);
    return res.status(500).json({ error: "Failed to fetch orders." });
  }
};

/**
 * Delete a placed order by ID
 */
exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  console.log("Request Params:", req.params);
  console.log("Received orderId:", orderId);

  // Check if orderId exists and is a valid number
  if (!orderId || isNaN(parseInt(orderId, 10))) {
    return res.status(400).json({ error: "Invalid orderId parameter" });
  }

  try {
    const order = await Orders.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const transaction = await sequelize.transaction();

    try {
      // First, delete the associated OrderItems
      await OrderItem.destroy({
        where: { order_id: orderId },
        transaction,
      });

      // Then delete the order itself
      await Orders.destroy({
        where: { id: orderId },
        transaction,
      });

      await transaction.commit();

      return res
        .status(200)
        .json({ message: "Order and associated items deleted successfully!" });
    } catch (error) {
      await transaction.rollback();
      console.error("Transaction error:", error);
      return res
        .status(500)
        .json({ error: "Failed to delete order and items" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};
