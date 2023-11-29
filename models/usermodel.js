const sequelize = require("../express/db");
const {DataTypes} = require("sequelize");

const User = sequelize.define("User",{
    id:{
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name:{
        allowNull: false,
        type: DataTypes.STRING,
    },
    surname:{
        allowNull: false,
        type: DataTypes.STRING,
    },
    email:{
        allowNull: false,
        type: DataTypes.STRING,
    },
    phone:{ 
        allowNull: false,
        type: DataTypes.STRING(100),
    },
    password:{
        allowNull: false,
        type: DataTypes.STRING,
    },
    sex:{
        allowNull: false,
        type: DataTypes.STRING,
    },
    SignDate:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    resetpassword:{
        type: DataTypes.STRING,
        allowNull: true
    },
    resetpassworddate:{
        type:DataTypes.DATE
    }
});
module.exports = User;