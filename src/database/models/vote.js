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
            idx: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            category: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
                unique: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: '',
                unique: false,
            },
            totalCount: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
                unique: false,
            },
            startTime: {
                type: Sequelize.DATE,
                allowNull: true,
                unique: false,
            },
            endTime: {
                type: Sequelize.DATE,
                allowNull: true,
                unique: false,
            },
            status: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
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
