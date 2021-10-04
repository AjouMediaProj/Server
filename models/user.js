/* Modules */
const Sequelize = require('sequelize');

/**
 * @class User
 * @description User database model
 */
class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                email: {
                    type: Sequelize.STRING(40),
                    allowNull: true,
                    unique: true,
                },
                nickname: {
                    type: Sequelize.STRING(15),
                    allowNull: false,
                    defaultValue: 'user0000',
                },
                password: {
                    type: Sequelize.STRING(64),
                    allowNull: true,
                },
                salt: {
                    type: Sequelize.STRING(64),
                    allowNull: true,
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: 'User',
                tableName: 'users',
                paranoid: true,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {}
}

/* Exports */
module.exports = User;
