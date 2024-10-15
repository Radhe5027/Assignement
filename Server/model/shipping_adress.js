const { DataTypes } = require('sequelize');
const sequelize = require('../database/db.js');
const Users = require('./Users.js');

const ShippingAddress = sequelize.define('ShippingAddress', {
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
  full_address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  zip_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'ShippingAddress',
  timestamps: false,
});

ShippingAddress.belongsTo(Users, { foreignKey: 'user_id' });

module.exports = ShippingAddress;
