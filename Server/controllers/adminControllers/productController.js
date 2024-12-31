const Product = require('../../model/products.js'); // Adjust the path as needed
const Category = require('../../model/categories.js');
const ProductVariant = require('../../model/product_variants.js');
const verifyAdmin = require('../../middleware/verifyAdmin.js');


exports.addProduct = async (req, res) => {
    const { 
        name, 
        description, 
        price, 
        categoryId, 
        newCategoryName, 
        newCategorySlug, 
        variants, 
        url_slug, 
        stock_quantity, 
        image_url  // Added image_url for the main product
    } = req.body;

    try {
        let categoryIdToUse = categoryId;
        let finalUrlSlug = url_slug || name.replace(/\s+/g, '-').toLowerCase(); // Default URL slug based on product name

        // If no category ID is provided, create a new category
        if (!categoryId && newCategoryName && newCategorySlug) {
            const newCategory = await Category.create({
                category_name: newCategoryName,
                url_slug: newCategorySlug,
                status: 'active'
            });
            categoryIdToUse = newCategory.id;
        }

        // Create the new product
        const product = await Product.create({
            product_name: name,
            description: description,
            price: price,
            cat_id: categoryIdToUse,
            url_slug: finalUrlSlug,   // Ensure url_slug is set
            status: 'active',
            stock_quantity: stock_quantity,
            image_url: image_url  // Set image_url for the product
        });

        // If variants are provided, create the associated product variants
        if (variants && Array.isArray(variants)) {
            const productVariants = variants.map(variant => ({
                product_id: product.id,
                color: variant.color,
                size: variant.size,
                price: variant.price,
                stock_quantity: variant.stock_quantity,  // Ensure stock_quantity is provided
                image_url: variant.image_url  // Add image_url for each variant
            }));

            // Bulk create product variants
            await ProductVariant.bulkCreate(productVariants);
        }

        res.status(201).json({
            message: 'Product and variants added successfully',
            product
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



// exports.updateProduct = async (req, res) => {
//     try {
//         const { id } = req.params; // Assuming you're passing the product ID in the URL
//         const { name, description, price, categoryId } = req.body;
//         const product = await Product.findByPk(id);
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
//         product.name = name;
//         product.description = description;
//         product.price = price;
//         product.categoryId = categoryId;
//         await product.save();
//         res.status(200).json({ message: 'Product updated successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        if (!req.user || req.user.role_id !== 1) {
            return res.status(403).json({ message: 'You do not have admin rights' });
        }

        // Delete all associated ProductVariant entries first
        await ProductVariant.destroy({ where: { product_id: id } });

        // Then, delete the product
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.destroy();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


