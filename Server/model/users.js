const { DataTypes } = require('sequelize');
const sequelize = require(''); 
const UserRole = require('./user_roles');

const Users = sequelize.define('Users',{
    //Define attributes

    id:{
        type:DataTypes.STRING,
        primaryKey:true,
        unique:true,
        autoIncrement:true,
    },
    role_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model : UserRole,
            key:'id'
        }


    },
    full_name:{
        type:DataTypes.STRING,
        allowNull:false,
    },


    email:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },

    password: {
        type: DataTypes.STRING,   // Password is stored as a string (hashed)
        allowNull: false ,         // Password cannot be null
        require: [true, "password is required"]
    },

    phone_number:{
        type:DataTypes.STRING,
        allowNull:false,

    },

    status:{
        type:DataTypes.ENUM('active', 'inactive', 'block'),
        allowNull:false,
        defaultValue: 'active' // optional 
    }
},{
    timestamps: true,
    tableName:'Users'
});


Users.belongsTo(UserRole,{foreignkey:'role_id'})
module.exports = Users;