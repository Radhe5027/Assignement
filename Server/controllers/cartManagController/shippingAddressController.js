const ShippingAddress = require("../../model/shipping_adress");
const Cart = require("../../model/carts.js");
const Product = require("../../model/products.js");
const ProductVariant = require("../../model/product_variants.js");
const jwt = require("jsonwebtoken");

// // Create a new shipping address
// exports.createShippingAddress = async (req, res) => {
//   try {
//     const { user_id, full_address, state, city, zip_code } = req.body;
//     const newAddress = await ShippingAddress.create({
//       user_id,
//       full_address,
//       state,
//       city,
//       zip_code,
//     });
//     res.status(201).json(newAddress);
//   } catch (error) {
//     console.error("Error creating shipping address:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// Create a new shipping address
exports.createShippingAddress = async (req, res) => {
  try {
    // Check if a token is provided
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).json({ error: "User not authenticated." });
    }

    const token = authHeader.split(" ")[1];
    let userId;

    try {
      // Decode the token to extract user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (error) {
      console.warn("Invalid token.");
      return res.status(401).json({ error: "Invalid token." });
    }

    // Check if the necessary address fields are provided
    const { full_address, state, city, zip_code } = req.body;
    if (!full_address || !state || !city || !zip_code) {
      return res
        .status(400)
        .json({ error: "All address fields are required." });
    }

    // Create the new address associated with the user ID
    const newAddress = await ShippingAddress.create({
      user_id: userId,
      full_address,
      state,
      city,
      zip_code,
    });

    res.status(201).json({ shippingAddress: newAddress });
  } catch (error) {
    console.error("Error creating shipping address:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getShippingAddresses = async (req, res) => {
  try {
    // Check if a token is provided
    const authHeader = req.headers.authorization;
    console.log("Authorization Header Reacived", authHeader);

    let userId;

    if (authHeader) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id; // Extract user ID if token is valid
      } catch (error) {
        console.warn("Invalid token, proceeding without user ID");
      }
    }

    if (!userId) {
      return res
        .status(400)
        .json({ error: "User not authenticated or token is invalid." });
    }

    // Fetch addresses based on user_id
    const addresses = await ShippingAddress.findAll({
      where: { user_id: userId },
    });

    // Return the addresses as a response
    res.status(200).json(addresses);
  } catch (error) {
    console.error("Error fetching shipping addresses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a shipping address
exports.updateShippingAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_address, state, city, zip_code } = req.body;

    const [updated] = await ShippingAddress.update(
      { full_address, state, city, zip_code },
      { where: { id } }
    );

    if (updated) {
      const updatedAddress = await ShippingAddress.findByPk(id);
      res.status(200).json(updatedAddress);
    } else {
      res.status(404).json({ error: "Shipping address not found" });
    }
  } catch (error) {
    console.error("Error updating shipping address:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a shipping address
exports.deleteShippingAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ShippingAddress.destroy({
      where: { id },
    });

    if (deleted) {
      res.status(204).send(); // No content to return
    } else {
      res.status(404).json({ error: "Shipping address not found" });
    }
  } catch (error) {
    console.error("Error deleting shipping address:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.makepayment = async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // amount in cents
      currency: "usd",
      // Optionally you can pass other configurations like metadata, receipt_email, etc.
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
