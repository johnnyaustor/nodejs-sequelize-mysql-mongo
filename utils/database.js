const { Sequelize } = require("sequelize");
const sequelize = new Sequelize('node_crud', 'root', 'mypassword', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;