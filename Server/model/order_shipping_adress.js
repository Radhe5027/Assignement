const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Orders = require('./orders');
const ShippingAddress = require('./shipping_adress');


const OrderShippingAddress = sequelize.define('OrderShippingAddress', {
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
  shipping_address_id: {
    type: DataTypes.INTEGER,
    references: {
      model: ShippingAddress,
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
  tableName: 'OrderShippingAddress',
  timestamps: false,
});

OrderShippingAddress.belongsTo(Orders, { foreignKey: 'order_id' });
OrderShippingAddress.belongsTo(ShippingAddress, { foreignKey: 'shipping_address_id' });

module.exports = OrderShippingAddress;
