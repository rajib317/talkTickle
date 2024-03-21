const { DataTypes } = require('sequelize');
const sequelize = require('../helpers/sql.connect');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
  voice: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Post;
