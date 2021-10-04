/* Modules */
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config').sequelize[env];

/* Models */
const User = require('./user');

const db = {};
const sequelize = new Sequelize(config.sequelize, config.username, config.password, config);

db.sequelize = sequelize;
db.User = User;

User.init(sequelize);
User.associate(db);

module.exports = db;
