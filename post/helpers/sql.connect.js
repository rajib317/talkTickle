const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('talk_tickle_post', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
