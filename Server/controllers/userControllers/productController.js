const Product = require('../../model/products.js'); // Adjust the path as needed
const Category = require('../../model/categories.js');
const ProductVariant = require('../../model/product_variants.js')

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include:[
                {
                    model:ProductVariant,
                    as:'variants',
                    attributes:['id','color','size','stock_quantity','image_url']
                },
            ],
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id, {
            include: [
                {
                    model: ProductVariant,
                    as: 'variants',
                    attributes: ['id', 'color', 'size', 'stock_quantity', 'image_url'],
                },
            ],
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.getProductsByCategory = async (req, res) => {
    try {
        const { subcategoryId } = req.params; // Extract subcategoryId from query parameters
        const products = await Product.findAll({ where: {cat_id:subcategoryId } });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll(); // Fetch all categories from the database
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getCategoriesWithSubcategories = async (req, res) => {
    try {
        // Fetch all active categories
        const categories = await Category.findAll({
            where: { status: 'active' }, // Fetch all categories that are active
        });

        // Create a map to hold categories by their IDs for easy access
        const categoryMap = {};
        categories.forEach(category => {
            categoryMap[category.id] = {
                id: category.id,
                category_name: category.category_name,
                subcategories: [],
            };
        });

        // Organize categories into parent and subcategories
        const formattedCategories = [];
        categories.forEach(category => {
            if (category.parent_cat_id) {
                // It's a subcategory; push it to its parent's subcategories
                const parentCategory = categoryMap[category.parent_cat_id];
                if (parentCategory) {
                    parentCategory.subcategories.push({
                        id: category.id,
                        category_name: category.category_name,
                    });
                }
            } else {
                // It's a parent category; push it to the formatted categories
                formattedCategories.push(categoryMap[category.id]);
            }
        });

        res.status(200).json(formattedCategories);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
