const { DataTypes } = require('sequelize');
const sequelize = require('../database/db.js');
const Category = require('./categories.js'); // Import the Category model

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url_slug: {
    type: DataTypes.TEXT,
    unique: true,
    allowNull: false,
  },
  cat_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Category,
      key: 'id',
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT(10, 2),
    allowNull: false,
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
  },
}, {
  tableName: 'Product',
  timestamps: false,
});

Product.belongsTo(Category, { foreignKey: 'cat_id' });

module.exports = Product;
