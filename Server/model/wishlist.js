const { DataTypes } = require('sequelize');
const sequelize = require('../database/db.js');
const Users = require('./Users')
const Product = require('./products');
const ProductVariant = require('./product_variants');

const Wishlist = sequelize.define('Wishlist', {
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
}, {
  tableName: 'Wishlist',
  timestamps: false,
});

Wishlist.belongsTo(Users, { foreignKey: 'user_id' });
Wishlist.belongsTo(Product, { foreignKey: 'product_id' });
Wishlist.belongsTo(ProductVariant, { foreignKey: 'product_variant_id' });

module.exports = Wishlist;
