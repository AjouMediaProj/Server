/**
 * vote.js
 * Last modified: 2021.10.13
 * Author: Lee Hong Jun
 * Description: Vote model
 */

/* Modules */
const Sequelize = require('sequelize');

/**
 * @class Vote
 * @description Vote database model
 */
class Vote extends Sequelize.Model {
    /**
     * @static @function initialize
     * @description
     *
     * @param {Sequelize} sequelize Sequelize object.
     * @return {}
     */
    static init(sequelize) {
        const attributes = {
            uid: {
                type: Sequelize.STRING(128),
                allowNull: false,
                unique: true,
            },
            title: {
                type: Sequelize.STRING(32),
                allowNull: true,
                unique: false,
            },
            period: {
                type: Sequelize.STRING(24),
                allowNull: true,
                defaultValue: '0000.00.00 ~ 0000.00.00',
                unique: false,
            },
            category: {
                type: Sequelize.STRING(32),
                allowNull: false,
                unique: false,
            },
        };

        const opts = {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Vote',
            tableName: 'votes',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        };

        return super.init(attributes, opts);
    }

    static associate(models) {}
}

/* Exports */
module.exports = Vote;
