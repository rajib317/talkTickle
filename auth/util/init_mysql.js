const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('user_auth', 'root', 'rajib', {
  host: 'db',
  dialect: 'mysql',
});
module.exports = sequelize;
