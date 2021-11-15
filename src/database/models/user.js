/**
 * user.js
 * Last modified: 2021.11.08
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: User Model in Sequelize
 */

/* Modules */
const Sequelize = require('sequelize');

/**
 * @class User
 * @description User database model
 */
class User extends Sequelize.Model {
    static init(sequelize) {
        // attributes
        const attributes = {
            idx: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING(32),
                allowNull: true,
            },
            nickname: {
                type: Sequelize.STRING(32),
                allowNull: true,
            },
            major: {
                type: Sequelize.INTEGER,
                unique: true,
                allowNull: false,
            },
            accessLevel: {
                type: Sequelize.INTEGER,
                defaultValue: 0, // 0: normal user, 1: administrator, -1: inactive account
                allowNull: false,
            },
        };

        // options
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
}

/* Exports */
module.exports = User;
