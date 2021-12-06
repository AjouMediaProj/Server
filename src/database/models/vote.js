/**
 * vote.js
 * Last modified: 2021.11. 27
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Vote model
 */

/* Modules */
const Sequelize = require('sequelize');
const BaseModel = require('@src/database/models/baseModel');
const Type = require('@src/utils/type');

/**
 * @class Vote
 * @description Vote database model
 */
class Vote extends BaseModel {
    /**
     * @static @function init
     * @description Initialize the Vote model
     *
     * @param {object} sequelize Instance of Sequelize.
     * @returns {Sequelize.Model}
     */
    static init(sequelize) {
        // modelName (sequelize model name), tableName (mysql table name)
        const mName = this.name;
        const tName = mName.toLowerCase() + 's';

        // Attributes of Vote model
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

        // Options of Vote model
        const opts = {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: mName,
            tableName: tName,
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        };

        return super.init(attributes, opts);
    }

    /**
     * @override
     * @static @function makeObject
     * @description Make new object.
     *
     * @param {Type.VoteObject} initData Data to initialize the object.
     * @returns {Type.VoteObject} New empty object based on model.
     */
    static makeObject(initData = null) {
        return super.makeObject(initData);
    }
}

/* Exports */
module.exports = Vote;
