const sequelize = require("../express/db");
const {DataTypes} = require("sequelize");

const Userrole = sequelize.define("Userrole",{
    id:{
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    role:{
        allowNull: false,
        type: DataTypes.STRING,
    },
});
module.exports = Userrole;