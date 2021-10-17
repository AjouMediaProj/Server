/**
 * candidate.js
 * Last modified: 2021.10.13
 * Author: Lee Hong Jun
 * Description: Candidate model
 */

/* Modules */
const Sequelize = require('sequelize');

/**
 * @class Candidate
 * @description Candidate database model
 */
class Candidate extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                uid: {
                    type: Sequelize.STRING(128),
                    allowNull: false,
                    unique: true,
                },
                name: {
                    type: Sequelize.STRING(20),
                    allowNull: true,
                    unique: false,
                    defaultValue: 'defaultValue0000',
                },
                img: {
                    type: Sequelize.STRING(200),
                    allowNull: true,
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: 'Candidate',
                tableName: 'candidates',
                paranoid: true,
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci',
            },
        );
    }

    static associate(models) {}
}

/* Exports */
module.exports = Candidate;
