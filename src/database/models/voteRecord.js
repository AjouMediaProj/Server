/**
 * voteRecord.js
 * Last modified: 2021.11.08
 * Author: Han Kyu Hyeon (kahmnkk, kyuhh1214@naver.com)
 * Description: VoteRecord model
 */

/* Modules */
const Sequelize = require('sequelize');
const BaseModel = require('@src/database/models/baseModel');
const type = require('@src/utils/type');

/**
 * @class VoteRecord
 * @description VoteRecord database model
 */
class VoteRecord extends BaseModel {
    static init(sequelize) {
        // modelName (sequelize model name), tableName (mysql table name)
        const mName = this.name;
        const tName = 'voteRecords';

        // Attributes of VoteRecord model
        const attributes = {
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
        };

        // Options of VoteRecord model
        const opts = {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: mName,
            tableName: tName,
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        };

        return super.init(attributes, opts);
    }

    /**
     * @override
     * @static @function makeObject
     * @description Make new data object based on type.VoteRecordObject
     *
     * @param {type.VoteRecordObject} initData Data to initialize the object
     * @returns {type.VoteRecordObject} New empty object based on type.VoteRecordObject
     */
    static makeObject(initData = null) {
        return super.makeObject(initData);
    }
}

/* Exports */
module.exports = VoteRecord;
