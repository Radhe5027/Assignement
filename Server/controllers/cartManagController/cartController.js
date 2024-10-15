const Cart = require('../../model/carts.js'); // Adjust the path as needed

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body; // Get product ID and quantity from request body
        const userId = req.user.id; // Get the logged-in user ID

        const existingCartItem = await Cart.findOne({ where: { userId, productId } });
        if (existingCartItem) {
            existingCartItem.quantity += quantity; // Update quantity if item already in cart
            await existingCartItem.save();
            return res.status(200).json({ message: 'Cart updated successfully' });
        }

        const newCartItem = await Cart.create({ userId, productId, quantity });
        res.status(201).json({ message: 'Product added to cart', cartItem: newCartItem });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getCartItems = async (req, res) => {
    try {
        const userId = req.user.id; // Get the logged-in user ID
        const cartItems = await Cart.findAll({ where: { userId } });
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { id, quantity } = req.body; // Assuming you pass cart item ID and new quantity
        const cartItem = await Cart.findByPk(id);
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        cartItem.quantity = quantity;
        await cartItem.save();
        res.status(200).json({ message: 'Cart item updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.removeCartItem = async (req, res) => {
    try {
        const { id } = req.params; // Assuming you pass cart item ID in the URL
        const deletedItem = await Cart.destroy({ where: { id } });
        if (!deletedItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        res.status(200).json({ message: 'Cart item removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id; // Get the logged-in user ID
        await Cart.destroy({ where: { userId } });
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({error:'Internal Server Error'});
    }
};
