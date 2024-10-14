const{DataTypes} = require ('sequelize');
const sequelize = require('');

const UserRole = sequelize.define('user_role',{
    //Define attributes
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },

    // it will have two roles ,, admin and user
    role_name:{
        type:DataTypes.STRING,
        allowNull:false
    }

},{
    timestamps:true,
    tableName:'user_role'
});

module.exports = UserRole;
