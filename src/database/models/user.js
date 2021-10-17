/**
 * user.js
 * Last modified: 2021.10.13
 * Author: Lee Hong Jun
 * Description: User model
 */

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
                uid: {
                    type: Sequelize.STRING(128),
                    allowNull: false,
                    unique: true,
                },
                email: {
                    type: Sequelize.STRING(40),
                    allowNull: false,
                    unique: true,
                },
                schoolEmail: {
                    type: Sequelize.STRING(40),
                    allowNull: true,
                },
                name: {
                    type: Sequelize.STRING(15),
                    allowNull: true,
                },
                nickname: {
                    type: Sequelize.STRING(15),
                    allowNull: true,
                    defaultValue: 'user0000',
                },
                password: {
                    type: Sequelize.STRING(128),
                    allowNull: true,
                },
                salt: {
                    type: Sequelize.STRING(64),
                    allowNull: true,
                },
                snsId: {
                    type: Sequelize.STRING(64),
                    allowNull: false,
                },
                provider: {
                    type: Sequelize.STRING(10),
                    allowNull: true,
                },
                isAdmin: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
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

    static associate(models) {}
}

/* Exports */
module.exports = User;
