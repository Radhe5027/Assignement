const Wishlist = require("../../model/wishlist");
const Product = require("../../model/products");
const ProductVariant = require("../../model/product_variants");

// Add Product Variant to Wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId, product_variant_id } = req.body; // Get product details
    const userId = req.user.id; // Get the logged-in user ID

    // Validate product
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
    }

    // Check if the product (or its variant) is already in the wishlist
    const existingWishlistItem = await Wishlist.findOne({
      where: {
        user_id: userId,
        product_id: productId,
        product_variant_id: product_variant_id || null, // Null if no variant
      },
    });

    if (existingWishlistItem) {
      return res
        .status(400)
        .json({ error: "This product is already in your wishlist." });
    }

    // Add the product (or variant) to the wishlist
    const wishlistItem = await Wishlist.create({
      user_id: userId,
      product_id: productId,
      product_variant_id: product_variant_id || null, // Null if no variant
    });

    res.status(201).json({
      message: "Product added to wishlist successfully.",
      wishlistItem,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get All Wishlist Items for a User
exports.getWishlist = async (req, res) => {
  const userId = req.user.id; // Assuming userId is available in req (e.g., via authentication middleware)

  try {
    const wishlist = await Wishlist.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          attributes: ["id", "product_name", "description"],
        },
        {
          model: ProductVariant,
          attributes: ["id", "color", "size", "image_url"],
        },
      ],
    });

    res.status(200).json({ wishlist });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the wishlist." });
  }
};

// Remove Item from Wishlist
exports.removeFromWishlist = async (req, res) => {
  const userId = req.user.id; // Assuming userId is available in req (e.g., via authentication middleware)
  const { wishlistItemId } = req.params;

  try {
    const wishlistItem = await Wishlist.findOne({
      where: { id: wishlistItemId, user_id: userId },
    });

    if (!wishlistItem) {
      return res.status(404).json({ error: "Wishlist item not found." });
    }

    await wishlistItem.destroy();

    res.status(200).json({ message: "Wishlist item removed successfully." });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res
      .status(500)
      .json({ error: "An error occurred while removing the wishlist item." });
  }
};
