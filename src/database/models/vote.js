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
    static init(sequelize) {
        return super.init(
            {
                uid: {
                    type: Sequelize.STRING(128),
                    allowNull: false,
                    unique: true,
                },
                title: {
                    type: Sequelize.STRING(40),
                    allowNull: true,
                    unique: false,
                },
                contents: {
                    type: Sequelize.STRING(200),
                    allowNull: true,
                    unique: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: 'Vote',
                tableName: 'votes',
                paranoid: true,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(models) {}
}

/* Exports */
module.exports = Vote;
