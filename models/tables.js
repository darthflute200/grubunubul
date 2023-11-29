const userrole = require("./userrolesmodel");
const user = require("./usermodel");
const ilan = require("./ilanmodel");
const sequelize = require("sequelize");
const createTableRelations = async function () {
    try {
      user.hasMany(ilan);
      ilan.belongsTo(user);
      user.belongsTo(userrole,);
      console.log('İlişkiler oluşturuldu.');
    } catch (err) {
      console.error(err);
    }
};
module.exports = createTableRelations;