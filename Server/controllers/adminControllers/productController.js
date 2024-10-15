const Product = require('../../model/products.js'); // Adjust the path as needed

exports.addProduct = async (req, res) => {
    try {
        const { name, description, price, categoryId } = req.body;
        const product = await Product.create({ name, description, price, categoryId });
        res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // Assuming you're passing the product ID in the URL
        const { name, description, price, categoryId } = req.body;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.name = name;
        product.description = description;
        product.price = price;
        product.categoryId = categoryId;
        await product.save();
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params; // Assuming you're passing the product ID in the URL
        const product = await Product.destroy({ where: { id } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
