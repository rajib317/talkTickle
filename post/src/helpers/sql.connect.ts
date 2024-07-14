import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('talk_tickle_post', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});
export default sequelize;
