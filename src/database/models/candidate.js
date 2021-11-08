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
                idx: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    unique: true,
                    primaryKey: true,
                },
                voteIdx: {
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
                img: {
                    type: Sequelize.STRING,
                    allowNull: true,
                    defaultValue: '',
                    unique: false,
                },
                txt: {
                    type: Sequelize.STRING,
                    allowNull: true,
                    defaultValue: '',
                    unique: false,
                },
                count: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                    unique: false,
                },
                status: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                    unique: false,
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
