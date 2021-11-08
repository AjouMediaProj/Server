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
        const attributes = {
            uid: {
                type: Sequelize.STRING(128),
                allowNull: false,
                unique: true,
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
            age: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            gender: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            birthday: {
                type: Sequelize.DATE,
            },
            accessLevel: {
                type: Sequelize.INTEGER,
                defaultValue: 0, // 0: normal user, 1: administrator, -1: inactive account
            },
        };

        const opts = {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        };

        return super.init(attributes, opts);
    }

    static associate(models) {}
}

/* Exports */
module.exports = User;
