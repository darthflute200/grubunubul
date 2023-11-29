const sequelize = require("../express/db");
const {DataTypes} = require("sequelize");
const squelize = require("sequelize")

const ilan = sequelize.define("ilan",{
    ilanid:{
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    baslik:{
        allowNull: false,
        type: DataTypes.STRING,
    },
    acıklama:{
        allowNull: false,
        type: DataTypes.STRING
    },
    grupresmi:{
        allowNull: false,
        type: DataTypes.STRING
    },
    aranan:{
        allowNull: false,
        type: DataTypes.STRING
    },
});
module.exports = ilan;