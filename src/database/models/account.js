/**
 * account.js
 * Last modified: 2021.11.03
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Account Model in Sequelize
 */

/* Modules */
const Sequelize = require('sequelize');

/**
 * @class Account
 * @description 'Account' sequelize model
 */
class Account extends Sequelize.Model {
    static init(sequelize) {
        const attributes = {
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
            password: {
                type: Sequelize.STRING(128),
                allowNull: true,
            },
            salt: {
                type: Sequelize.STRING(64),
                allowNull: true,
            },
            snsId: {
                type: Sequelize.STRING(32),
                defaultValue: -1,
            },
            provider: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
        };

        const opts = {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Account',
            tableName: 'accounts',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        };

        return super.init(attributes, opts);
    }

    static associate(models) {}
}

/* Exports */
module.exports = Account;
