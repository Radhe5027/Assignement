const Product = require('../../model/products.js'); // Adjust the path as needed

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params; // Assuming you're passing the product ID in the URL
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params; // Assuming you're passing the category ID in the URL
        const products = await Product.findAll({ where: { categoryId } });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
