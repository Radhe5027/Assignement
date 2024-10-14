const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Users = require('./users');

const Orders = sequelize.define('Orders', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Users,
      key: 'id',
    },
  },
  total_amount: {
    type: DataTypes.FLOAT(10, 2),
    allowNull: false,
  },
  discount_amount: {
    type: DataTypes.FLOAT(10, 2),
    allowNull: true,
  },
  gross_amount: {
    type: DataTypes.FLOAT(10, 2),
    allowNull: false,
  },
  shipping_amount: {
    type: DataTypes.FLOAT(10, 2),
    allowNull: false,
  },
  net_amount: {
    type: DataTypes.FLOAT(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('placed', 'processing', 'shipping', 'delivered'),
    allowNull: false,
  },
  payment_status: {
    type: DataTypes.ENUM('paid', 'not paid'),
    allowNull: false,
  },
  payment_type: {
    type: DataTypes.ENUM('netbanking', 'upi', 'cod'),
    allowNull: false,
  },
  payment_transaction_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'Orders',
  timestamps: false,
});

Orders.belongsTo(Users, { foreignKey: 'user_id' });

module.exports = Orders;
