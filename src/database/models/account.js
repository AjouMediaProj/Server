/**
 * account.js
 * Last modified: 2021.11.08
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
        // attributes
        const attributes = {
            idx: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            email: {
                type: Sequelize.STRING(48),
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(64),
                allowNull: false,
            },
            salt: {
                type: Sequelize.STRING(32),
                allowNull: false,
            },
        };

        // options
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
}

/* Exports */
module.exports = Account;
