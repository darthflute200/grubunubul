const {Sequelize , DataTypes} = require('sequelize');
const mysql = require('mysql2');
const sequelize = new Sequelize('grubunubul.com', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
  });
async function databaseconnect(){
  try{
    await sequelize.authenticate();
    console.log("Veritabanına Bağlandın");
  }
  catch(err){
    console.log(err);
  }
};
databaseconnect();

module.exports = sequelize;



