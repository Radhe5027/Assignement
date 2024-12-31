const Cart = require("../../model/carts.js"); // Adjust the path as needed
const Product = require("../../model/products.js");
const ProductVariant = require("../../model/product_variants.js");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, product_variant_id } = req.body; // Get product details
    const userId = req.user.id; // Get the logged-in user ID

    // Validate product and variant
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    console.log("Product found:", product); // Log product details

    // If product_variant_id is provided, handle the variant logic
    if (product_variant_id) {
      const variant = await ProductVariant.findByPk(product_variant_id);
      if (!variant) {
        return res.status(404).json({ error: "Product variant not found." });
      }
      console.log("Variant found:", variant); // Log variant details

      // Validate stock quantity for the variant
      if (variant.stock_quantity < quantity) {
        return res
          .status(400)
          .json({ error: "Not enough stock available for this variant." });
      }

      // Deduct quantity from variant stock
      variant.stock_quantity -= quantity;
      console.log("Updated variant stock_quantity:", variant.stock_quantity); // Log updated stock quantity
      await variant.save();

      // Check if the item is already in the cart for this variant
      const existingCartItem = await Cart.findOne({
        where: {
          user_id: userId,
          product_id: productId,
          product_variant_id: product_variant_id,
        },
      });
      if (existingCartItem) {
        existingCartItem.quantity += quantity; // Update the quantity in the cart
        await existingCartItem.save();
        return res
          .status(200)
          .json({
            message: "Cart updated successfully.",
            cartItem: existingCartItem,
          });
      }

      // Create new cart item
      const newCartItem = await Cart.create({
        user_id: userId,
        product_id: productId,
        product_variant_id: product_variant_id,
        quantity,
      });
      return res
        .status(201)
        .json({
          message: "Product variant added to cart.",
          cartItem: newCartItem,
        });
    } else {
      // If no variant is specified, handle it accordingly (if needed)
      return res.status(400).json({ error: "Product variant ID is required." });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getCartItems = async (req, res) => {
  try {
    const userId = req.user.id; // Get the logged-in user ID
    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: [
        { model: Product, attributes: ["product_name", "price"] },
        { model: ProductVariant, attributes: ["color", "image_url"] },
      ],
    });
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// In your cart controller (e.g., cartController.js)
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, product_variant_id, quantity } = req.body; // Get from request body
    const userId = req.user.id;

    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1." });
    }

    // Find the cart item based on product_id and product_variant_id
    const cartItem = await Cart.findOne({
      where: {
        user_id: userId,
        product_id: productId,
        product_variant_id: product_variant_id, // Can be null if not a variant
      },
      include: [ProductVariant],
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found." });
    }

    // Check stock availability
    if (cartItem.product_variant_id) {
      const variant = await ProductVariant.findByPk(
        cartItem.product_variant_id
      );
      if (variant.stock_quantity < quantity - cartItem.quantity) {
        return res.status(400).json({ error: "Not enough stock available." });
      }
      variant.stock_quantity -= quantity - cartItem.quantity;
      await variant.save();
    } else {
      // Handle products without variants
      const product = await Product.findByPk(cartItem.product_id);
      if (product.stock_quantity < quantity - cartItem.quantity) {
        return res.status(400).json({ error: "Not enough stock available." });
      }
      product.stock_quantity -= quantity - cartItem.quantity;
      await product.save();
    }

    // Update the quantity in the cart
    cartItem.quantity = quantity;
    await cartItem.save();

    res
      .status(200)
      .json({ message: "Cart item updated successfully.", cartItem });
  } catch (error) {
    console.error("Error updating cart item:", error.message); // More detailed error logging
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const productId = req.query.product_id;
    const product_variant_id = req.query.product_variant_id || null; // Get product_id and product_variant_id from request body
    const userId = req.user.id; // Getting the authenticate user

    // Find the cart items based on the user_id, product_id, and product_variant_id
    const cartItem = await Cart.findOne({
      where: {
        user_id: userId,
        product_id: productId,
        product_variant_id: product_variant_id || null,
      },
      include: [ProductVariant],
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found." });
    }

    // Restore stock only if a product variant exists
    if (cartItem.product_variant_id) {
      const variant = await ProductVariant.findByPk(
        cartItem.product_variant_id
      );
      if (variant) {
        // Increase stock quantity of the product variant
        variant.stock_quantity += cartItem.quantity;
        await variant.save();
      } else {
        return res.status(404).json({ error: "Product variant not found." });
      }
    }

    await cartItem.destroy();

    res.status(200).json({ message: "Cart item removed successfully." });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` contains the logged-in user info.

    // Debugging: log the userId to ensure it's correct
    console.log(`Attempting to clear cart for user_id: ${userId}`);

    // Attempt to delete cart items for the given user
    const result = await Cart.destroy({ where: { user_id: userId } });

    // If no rows were deleted, return a 404
    if (result === 0) {
      return res
        .status(404)
        .json({ message: "No cart items found for this user" });
    }

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
