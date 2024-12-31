const { DataTypes } = require('sequelize');
const sequelize = require('../database/db.js');
const Users = require('./users.js');
const Product = require('./products');
const ProductVariant = require('./product_variants');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Users,
      key: 'id',
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'Cart',
  timestamps: false,
});

Cart.belongsTo(Users, { foreignKey: 'user_id' });
Cart.belongsTo(Product, { foreignKey: 'product_id' });
Cart.belongsTo(ProductVariant, { foreignKey: 'product_variant_id' });

module.exports = Cart;
