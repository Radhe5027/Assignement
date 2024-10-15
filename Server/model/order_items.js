const { DataTypes } = require('sequelize');
const sequelize = require('../database/db.js');
const Orders = require('./orders');
const Product = require('./products');
const ProductVariant = require('./product_variants');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Orders,
      key: 'id',
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id',
    },
  },
  product_variant_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: ProductVariant,
      key: 'id',
    },
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  size: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT(10, 2),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.FLOAT(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'OrderItem',
  timestamps: false,
});

OrderItem.belongsTo(Orders, { foreignKey: 'order_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'product_variant_id' });

module.exports = OrderItem;
