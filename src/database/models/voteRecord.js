/**
 * voteRecord.js
 * Last modified: 2021.11.08
 * Author: Han Kyu Hyeon (kahmnkk, kyuhh1214@naver.com)
 * Description: VoteRecord model
 */

/* Modules */
const Sequelize = require('sequelize');

/**
 * @class VoteRecord
 * @description VoteRecord database model
 */
class VoteRecord extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                voteIdx: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                userIdx: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                status: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: 'VoteRecord',
                tableName: 'voteRecords',
                paranoid: true,
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci',
            },
        );
    }

    static associate(models) {}
}

/* Exports */
module.exports = VoteRecord;
